const fs = require("hexo-fs");
const path = require("path");
let hexo = null;
let SCAFFOLD_DIR = null;

function setup(hexoInstance) {
  hexo = hexoInstance;
  SCAFFOLD_DIR = hexo.scaffold_dir;
}

function getAllScaffoldNames() {
  let allScaffolds = [];
  const files = fs.readdirSync(SCAFFOLD_DIR, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isFile()) {
      allScaffolds.push(path.basename(file.name, ".md"));
    }
  });
  return allScaffolds;
}

function update(name, content) {
  return fs.writeFileSync(path.join(SCAFFOLD_DIR, name + ".md"), content);
}

function getAllScaffoldData() {
  const allScaffoldNames = getAllScaffoldNames();
  let allScaffolds = [];
  allScaffoldNames.forEach((scaffoldName) => {
    let fileName = path.join(SCAFFOLD_DIR, scaffoldName + ".md");
    allScaffolds.push({
      name: scaffoldName,
      fileName: fileName,
      content: fs.readFileSync(fileName),
    });
  });
  return allScaffolds;
}

function rename(oldName, newName) {
  const oldPath = path.join(SCAFFOLD_DIR, oldName + ".md");
  const newPath = path.join(SCAFFOLD_DIR, newName + ".md");
  return fs.renameSync(oldPath, newPath);
}

function create(name) {
  return update(name, "---\ntitle: {{ title }}\ntags:\n---");
}

function deleteScaffold(name) {
  const scaffoldPath = path.join(SCAFFOLD_DIR, name + ".md");
  return fs.unlinkSync(scaffoldPath);
}

module.exports = {
  setup: setup,
  getNames: getAllScaffoldNames,
  getAllData: getAllScaffoldData,
  update: update,
  rename: rename,
  create: create,
  delete: deleteScaffold,
};
