const fs = require("hexo-fs");
const path = require("path");
const formidable = require("formidable");

let hexo = null;
let SOURCE_DIR = null;
let ASSETS_DIR = null;
let ASSETS_DIR_TMP = null;

function setup(hexoInstance) {
  hexo = hexoInstance;
  SOURCE_DIR = hexo.source_dir;
  ASSETS_DIR = path.join(SOURCE_DIR, "files");
  ASSETS_DIR_TMP = path.join(ASSETS_DIR, "tmp");

  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirsSync(ASSETS_DIR);
  }

  if (!fs.existsSync(ASSETS_DIR_TMP)) {
    fs.mkdirsSync(ASSETS_DIR_TMP);
  }
}

function moveAsset(oldPath, newPath) {
  const newDirectory = path.dirname(newPath);
  if (!fs.existsSync(newDirectory)) {
    fs.mkdirsSync(newDirectory);
  }
  while (fs.existsSync(newPath)) {
    let randNumber = Math.floor(Math.random() * 10000);
    let fileName = path.basename(newPath);
    newPath = path.join(newDirectory, randNumber + "-" + fileName);
  }
  return fs.renameSync(oldPath, newPath);
}

function upload(req, res) {
  const form = formidable({ multiples: true, uploadDir: ASSETS_DIR_TMP, keepExtensions: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      res.sendError("Sorry, something went wrong.");
      return;
    }
    const destinationDirectory = path.join(SOURCE_DIR, fields.directory || "files");
    for (let currentFile in files) {
      const oldPath = files[currentFile].filepath;
      const fileName = files[currentFile].originalFilename;
      let newPath = path.join(destinationDirectory, fileName);
      moveAsset(oldPath, newPath);
    }
    res.sendSuccess("Upload complete!");
  });
}

function listDirectory(dirName) {
  if (dirName) {
    dirName = path.join(SOURCE_DIR, dirName);
  } else {
    dirName = ASSETS_DIR;
  }

  if (!fs.existsSync(dirName)) {
    dirName = ASSETS_DIR;
  }
  const allFiles = [];
  const files = fs.readdirSync(dirName, { withFileTypes: true });
  const baseDir = dirName.split(SOURCE_DIR)[1];
  files.forEach((file) => {
    allFiles.push({
      name: file.name,
      filePath: path.join(baseDir, file.name),
      isDir: file.isDirectory(),
    });
  });
  return {
    currentDir: dirName.split(SOURCE_DIR)[1],
    separator: path.sep,
    files: allFiles,
  };
}

function createDirectory(dirName) {
  const newDir = path.join(SOURCE_DIR, dirName);
  if (!fs.existsSync(newDir)) {
    fs.mkdirsSync(newDir);
    return "Directory created!";
  } else {
    throw new Error(`${newDir} already exists!`);
  }
}

function deleteDirectory(dirName) {
  const dirPath = path.join(SOURCE_DIR, dirName);
  return fs.rmdirSync(dirPath, { recursive: true });
}

function deleteFile(filePath) {
  const fullFilePath = path.join(SOURCE_DIR, filePath);
  return fs.unlinkSync(fullFilePath);
}

function rename(oldPath, newPath) {
  const fullOldPath = path.join(SOURCE_DIR, oldPath);
  const fullNewPath = path.join(SOURCE_DIR, newPath);
  return fs.renameSync(fullOldPath, fullNewPath);
}

module.exports = {
  setup: setup,
  upload: upload,
  listDirectory: listDirectory,
  createDirectory: createDirectory,
  deleteDirectory: deleteDirectory,
  deleteFile: deleteFile,
  rename: rename,
};
