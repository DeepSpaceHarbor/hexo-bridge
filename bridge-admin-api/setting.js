const fs = require("hexo-fs");
const path = require("path");
const yaml = require("js-yaml");
let hexo = null;
let HEXO_CONFIG_PATH = null;
let BRIDGE_CONFIG_PATH = null;

function setup(hexoInstance) {
  hexo = hexoInstance;
  HEXO_CONFIG_PATH = hexo.config_path;
  BRIDGE_CONFIG_PATH = path.join(hexo.base_dir, "_bridge.yml");
  if (!fs.existsSync(BRIDGE_CONFIG_PATH)) {
    resetBridgeConfig();
  }
}

function saveFile(file, content) {
  return fs.writeFileSync(file, content);
}

function resetBridgeConfig() {
  saveFile(
    BRIDGE_CONFIG_PATH,
    fs.readFileSync(path.join(__dirname, "_bridge.yml"))
  );
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
    yaml.load(content);
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
    return yaml.load(fs.readFileSync(BRIDGE_CONFIG_PATH));
  } catch (error) {
    resetBridgeConfig();
    return yaml.load(fs.readFileSync(path.join(__dirname, "_bridge.yml")));
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
