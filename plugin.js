const fs = require("hexo-fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

let hexo = null;
const ALL_PLUGINS_LIST_PATH = path.join(__dirname, "data", "plugins.json");

async function setup(hexoInstance) {
  hexo = hexoInstance;
  try {
    //Check if update is needed.
    if (fs.existsSync(ALL_PLUGINS_LIST_PATH)) {
      const currentData = JSON.parse(fs.readFileSync(ALL_PLUGINS_LIST_PATH));
      // One day in milliseconds
      const oneDay = 1000 * 60 * 60 * 24;
      const diffInTime = new Date().getTime() - new Date(currentData.updated).getTime();
      const diffInDays = Math.round(diffInTime / oneDay);
      if (diffInDays < 7) {
        return; //No need to update.
      }
    }
    //Parse the list of plugins from the hexo website.
    const res = await axios.get("https://hexo.io/plugins/");
    const $ = cheerio.load(res.data);
    let byTags = {
      all: {
        plugins: [],
        count: 0,
      },
    };
    $("#plugin-list > .plugin").each((i, el) => {
      const name = $(el).find(".plugin-name").text().trim();
      const description = $(el).find(".plugin-desc").text().trim();
      const link = $(el).find(".plugin-name").attr("href");
      const tags = [];
      $(el)
        .find(".plugin-tag")
        .each((i, el) => {
          tags.push($(el).text().trim());
        });

      //Sort the plugins based on tags.
      const plugin = { name, description, link, tags };
      byTags.all.plugins.push(plugin);
      byTags.all.count += 1;
      plugin.tags.forEach((tag) => {
        tag = tag.toString().trim().toLowerCase();
        if (!byTags.hasOwnProperty(tag)) {
          byTags[tag] = {
            plugins: [],
            count: 0,
          };
        }
        byTags[tag].plugins.push(plugin);
        byTags[tag].count += 1;
      });
    });

    //Save the list of plugins to a file.
    fs.writeFile(
      ALL_PLUGINS_LIST_PATH,
      JSON.stringify({
        updated: new Date().toDateString(),
        plugins: byTags,
      })
    );
  } catch (error) {
    //Do nothing, use the local file.
  }
}

function getAll() {
  const data = JSON.parse(fs.readFileSync(ALL_PLUGINS_LIST_PATH));
  return data.plugins;
}

function getInstalled() {
  const allPlugins = getAll();
  const packageJson = require(path.join(hexo.base_dir, "package.json"));
  let hexoPlugins = [];
  //TODO: Exclude themes when hexo 5 is launched.
  //https://github.com/hexojs/hexo/issues/3890
  for (let module in packageJson.dependencies) {
    if (module.startsWith("hexo-") && !module.startsWith("hexo-theme")) {
      let moduleInfo = allPlugins.all.plugins.find((item) => item.name === module);
      if (!moduleInfo) {
        moduleInfo = {};
      }
      hexoPlugins.push({
        name: module,
        version: packageJson.dependencies[module],
        description: moduleInfo.description,
        link: moduleInfo.link,
      });
    }
  }
  return hexoPlugins;
}

function getScriptsFromDirectory(dir) {
  const allScripts = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isFile() && file.name.endsWith(".js")) {
      allScripts.push({
        name: file.name,
        filePath: path.join(dir, file.name),
        content: fs.readFileSync(path.join(dir, file.name)),
      });
    }
    if (file.isDirectory()) {
      allScripts.push(...getScriptsFromDirectory(path.join(dir, file.name)));
    }
  });
  return allScripts;
}

function getScripts() {
  if (fs.existsSync(hexo.script_dir)) {
    return getScriptsFromDirectory(hexo.script_dir);
  } else {
    return [];
  }
}

module.exports = {
  setup: setup,
  getAll: getAll,
  getInstalled: getInstalled,
  getScripts: getScripts,
};
