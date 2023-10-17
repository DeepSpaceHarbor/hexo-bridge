const fs = require("hexo-fs");
const path = require("path");
let hexo = null;
let HEXO_CONFIG_PATH = null;
let BRIDGE_CONFIG_PATH = null;
const YAWN = require("yawn-yaml/cjs");

function setup(hexoInstance) {
  hexo = hexoInstance;
  HEXO_CONFIG_PATH = hexo.config_path;
  BRIDGE_CONFIG_PATH = path.join(hexo.base_dir, "_bridge.yml");
  if (!fs.existsSync(BRIDGE_CONFIG_PATH)) {
    resetBridgeConfig();
  }
  const config = new YAWN(fs.readFileSync(BRIDGE_CONFIG_PATH)).toJSON();
  //Check if the config is valid
  let configTemplate = `# Font size for the code editor. The default is 14.
  editorFontSize: 14
  editorDarkMode: false
  # All posts page.
  post_list_itemsPerPage: 7
  post_list_showCategories: true
  post_list_showTags: true
  # All pages page.
  page_list_itemsPerPage: 7
  # When new posts, pages, etc, are created, hexo needs to update its database before bridge is allowed to display the editor.
  # This config controls the waiting time before attempting to fetch the newly created content.
  content_fetch_timeout: 200 # Time is in milliseconds
`;
  let newConfig = new YAWN(configTemplate);
  //Editor config
  if (config.editorFontSize) {
    newConfig.json = {
      ...newConfig.json,
      editorFontSize: config.editorFontSize,
    };
  }
  if (config.editorDarkMode) {
    newConfig.json = {
      ...newConfig.json,
      editorDarkMode: config.editorDarkMode,
    };
  }
  //Post list config
  if (config.post_list_itemsPerPage) {
    newConfig.json = {
      ...newConfig.json,
      post_list_itemsPerPage: config.post_list_itemsPerPage,
    };
  }
  if (config.post_list_showCategories) {
    newConfig.json = {
      ...newConfig.json,
      post_list_showCategories: config.post_list_showCategories,
    };
  }
  if (config.post_list_showTags) {
    newConfig.json = {
      ...newConfig.json,
      post_list_showTags: config.post_list_showTags,
    };
  }
  //Page list config
  if (config.page_list_itemsPerPage) {
    newConfig.json = {
      ...newConfig.json,
      ...newConfig.json,
      page_list_itemsPerPage: config.page_list_itemsPerPage,
    };
  }
  //Content fetch timeout
  if (config.content_fetch_timeout) {
    newConfig.json = {
      ...newConfig.json,
      ...newConfig.json,
      content_fetch_timeout: config.content_fetch_timeout,
    };
  }
  saveBridgeConfig(newConfig.yaml);
}

function saveFile(file, content) {
  return fs.writeFileSync(file, content);
}

function resetBridgeConfig() {
  saveFile(BRIDGE_CONFIG_PATH, fs.readFileSync(path.join(__dirname, "_bridge.yml")));
}

function getHexoConfig() {
  const config = fs.readFileSync(HEXO_CONFIG_PATH);
  return {
    fileName: HEXO_CONFIG_PATH,
    config: config,
  };
}

function saveHexoConfig(newConfig) {
  return saveFile(HEXO_CONFIG_PATH, newConfig);
}

function saveBridgeConfig(newConfig) {
  return saveFile(BRIDGE_CONFIG_PATH, newConfig);
}

function validateYaml(content) {
  try {
    new YAWN(content).toJSON();
    return {
      error: [],
    };
  } catch (error) {
    return {
      error: error,
    };
  }
}

function getBridgeConfig() {
  const config = fs.readFileSync(BRIDGE_CONFIG_PATH);
  return {
    fileName: BRIDGE_CONFIG_PATH,
    config: config,
  };
}

function getBridgeConfigAsJson() {
  try {
    return new YAWN(fs.readFileSync(BRIDGE_CONFIG_PATH)).toJSON();
  } catch (error) {
    resetBridgeConfig();
    return new YAWN(fs.readFileSync(path.join(__dirname, "_bridge.yml"))).toJSON();
  }
}

module.exports = {
  setup: setup,
  getHexoConfig: getHexoConfig,
  saveHexoConfig: saveHexoConfig,
  getBridgeConfig: getBridgeConfig,
  getBridgeConfigAsJson: getBridgeConfigAsJson,
  saveBridgeConfig: saveBridgeConfig,
  validate: validateYaml,
};
