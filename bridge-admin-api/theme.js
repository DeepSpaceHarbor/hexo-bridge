const fs = require("hexo-fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

let hexo = null;
const ALL_THEMES_LIST_PATH = path.join(__dirname, "data", "themes.json");
let THEME_CONFIG_PATH = null;

async function setup(hexoInstance) {
  hexo = hexoInstance;
  THEME_CONFIG_PATH = path.join(hexo.theme_dir, "_config.yml");
  if (!fs.existsSync(THEME_CONFIG_PATH)) {
    saveFile(THEME_CONFIG_PATH, "");
  }
  try {
    //Check if update is needed.
    if (fs.existsSync(ALL_THEMES_LIST_PATH)) {
      const currentData = JSON.parse(fs.readFileSync(ALL_THEMES_LIST_PATH));
      // One day in milliseconds
      const oneDay = 1000 * 60 * 60 * 24;
      const diffInTime = new Date().getTime() - new Date(currentData.updated).getTime();
      const diffInDays = Math.round(diffInTime / oneDay);
      if (diffInDays < 7) {
        return; //No need to update.
      }
    }

    //Parse themes from the hexo website.
    const res = await axios.get("https://hexo.io/themes/");
    const $ = cheerio.load(res.data);
    let byTags = {
      all: {
        themes: [],
        count: 0,
      },
    };
    $("#plugin-list > .plugin").each((i, el) => {
      const name = $(el).find(".plugin-name").text().trim();
      const description = $(el).find(".plugin-desc").text().trim();
      const link = $(el).find(".plugin-name").attr("href");
      const preview = $(el).find(".plugin-preview-link").attr("href");
      const screenshot = "https://hexo.io" + $(el).find(".plugin-screenshot-img").attr("data-zoom-src");
      const tags = [];
      $(el)
        .find(".plugin-tag")
        .each((i, el) => {
          tags.push($(el).text().trim());
        });
      //Sort the themes based on tags
      const theme = { name, desc: description, link, preview, screenshot, tags };
      byTags.all.themes.push(theme);
      byTags.all.count += 1;
      theme.tags.forEach((tag) => {
        tag = tag.toString().trim().toLowerCase();
        if (!byTags.hasOwnProperty(tag)) {
          byTags[tag] = {
            themes: [],
            count: 0,
          };
        }
        byTags[tag].themes.push(theme);
        byTags[tag].count += 1;
      });
    });

    fs.writeFile(
      ALL_THEMES_LIST_PATH,
      JSON.stringify({
        updated: new Date().toDateString(),
        themes: byTags,
      })
    );
  } catch (error) {
    //Do nothing, use the local file.
  }
}

function getAll() {
  const data = JSON.parse(fs.readFileSync(ALL_THEMES_LIST_PATH));
  return data.themes;
}

function getConfig() {
  const config = fs.readFileSync(THEME_CONFIG_PATH);
  return {
    fileName: THEME_CONFIG_PATH,
    config: config,
  };
}

function saveFile(file, content) {
  return fs.writeFileSync(file, content);
}

function saveConfig(content) {
  return saveFile(THEME_CONFIG_PATH, content);
}

function getInstalled() {
  //TODO: Parse package.json when hexo 5 goes live.
  // https://github.com/hexojs/hexo/issues/3890
  const allThemes = getAll();
  let installed = [];
  const currentTheme = path.basename(hexo.theme_dir).toLowerCase();
  const dir = path.join(hexo.base_dir, "themes");
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isDirectory()) {
      const themeInfo = allThemes.all.themes.find((item) => item.name.toLowerCase() === file.name.toLowerCase());
      installed.push({
        ...themeInfo,
        name: file.name,
        isActive: file.name.toLowerCase() === currentTheme,
      });
    }
  });
  const packageJson = require(path.join(hexo.base_dir, "package.json"));
  for (let module in packageJson.dependencies) {
    if (module.startsWith("hexo-theme")) {
      let moduleInfo = allThemes.all.themes.find((item) => item.name === module.substring(11));
      if (!moduleInfo) {
        moduleInfo = {};
      }
      installed.push({
        ...moduleInfo,
        name: module,
        isActive: module.toLowerCase() === currentTheme,
      });
    }
  }
  return installed;
}

module.exports = {
  setup: setup,
  getAll: getAll,
  getInstalled: getInstalled,
  getConfig: getConfig,
  saveConfig: saveConfig,
};
