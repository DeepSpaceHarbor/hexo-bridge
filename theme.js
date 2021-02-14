const fs = require("hexo-fs");
const path = require("path");
const axios = require("axios");
const yaml = require("js-yaml");
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
    //Download official theme list
    const res = await axios({
      method: "GET",
      url:
        "https://raw.githubusercontent.com/hexojs/site/master/source/_data/themes.yml",
    });
    const allThemes = yaml.load(res.data);
    //Sort by tags
    let byTags = {
      all: {
        themes: [],
        count: 0,
      },
    };

    allThemes.forEach((theme) => {
      let screenShotURL = `https://raw.githubusercontent.com/hexojs/site/master/source/themes/screenshots/${theme.name}.png`;
      let screenShotLowercaseURL = `https://raw.githubusercontent.com/hexojs/site/master/source/themes/screenshots/${theme.name.toLowerCase()}.png`;
      theme.screenshot = screenShotURL;
      //Known bugs
      switch (theme.name) {
        case "Type":
          theme.screenshot = screenShotLowercaseURL;
          break;
        case "Vita":
          theme.screenshot = screenShotLowercaseURL;
          break;
        case "Miracle":
          theme.screenshot = screenShotLowercaseURL;
          break;
      }
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
    fs.writeFile(ALL_THEMES_LIST_PATH, JSON.stringify(byTags));
  } catch (error) {
    console.error("Got error while fetching themes list.", error);
  }
}

function getAll() {
  return JSON.parse(fs.readFileSync(ALL_THEMES_LIST_PATH));
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
      const themeInfo = allThemes.all.themes.find(
        (item) => item.name.toLowerCase() === file.name.toLowerCase()
      );
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
      let moduleInfo = allThemes.all.themes.find(
        (item) => item.name === module.substring(11)
      );
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
