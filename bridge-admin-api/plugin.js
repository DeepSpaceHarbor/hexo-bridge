const fs = require("hexo-fs");
const path = require("path");
const axios = require("axios");
const yaml = require("js-yaml");
let hexo = null;
const ALL_PLUGINS_LIST_PATH = path.join(__dirname, "data", "plugins.json");

async function setup(hexoInstance) {
  hexo = hexoInstance;

  try {
    //Download official plugin list
    const res = await axios({
      method: "GET",
      url:
        "https://raw.githubusercontent.com/hexojs/site/master/source/_data/plugins.yml",
    });
    const allPlugins = yaml.load(res.data);
    //Sort by tags
    let byTags = {
      all: {
        plugins: [],
        count: 0,
      },
    };
    allPlugins.forEach((plugin) => {
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
    fs.writeFile(ALL_PLUGINS_LIST_PATH, JSON.stringify(byTags));
  } catch (error) {
    console.error("Got error while fetching plugins list.", error);
  }
}

function getAll() {
  return JSON.parse(fs.readFileSync(ALL_PLUGINS_LIST_PATH));
}

function getInstalled() {
  const allPlugins = getAll();
  const packageJson = require(path.join(hexo.base_dir, "package.json"));
  let hexoPlugins = [];
  //TODO: Exclude themes when hexo 5 is launched.
  //https://github.com/hexojs/hexo/issues/3890
  for (let module in packageJson.dependencies) {
    if (module.startsWith("hexo-") && !module.startsWith("hexo-theme")) {
      let moduleInfo = allPlugins.all.plugins.find(
        (item) => item.name === module
      );
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
