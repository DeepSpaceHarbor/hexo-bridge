const fs = require("hexo-fs");
const path = require("path");
const frontMatterHelper = require("hexo-front-matter");

let hexo = null;
let Page = null;
let SOURCE_DIR = null;

function setup(hexoInstance) {
  hexo = hexoInstance;
  Page = hexo.model("Page");

  SOURCE_DIR = hexo.source_dir;
}

function getAllPages() {
  return Page.toArray();
}

async function getSinglePage(id) {
  const currentPage = Page.get(id);
  if (currentPage) {
    return currentPage;
  } else {
    throw new Error("Invalid page id: " + id);
  }
}

async function save(id, content) {
  const currentPage = await getSinglePage(id);
  const pagePath = currentPage.full_source;
  await fs.writeFileSync(pagePath, content);
  return "Success!";
}

async function updateContent(id, content) {
  const currentPage = await getSinglePage(id);
  const pagePath = currentPage.full_source;
  const parsed = frontMatterHelper.parse(currentPage.raw);
  const metadata = (({ _content, ...others }) => ({ ...others }))(parsed);
  const newContent = frontMatterHelper.stringify(metadata) + content;
  await fs.writeFileSync(pagePath, newContent);
  return "Success!";
}

async function getNewPage(newPath) {
  //TODO: Find a way to do this without setTimeout.
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve((newPage = Page.findOne({ source: newPath.split(SOURCE_DIR)[1] })));
    }, 200);
  });
}

async function create(title) {
  const newPageInfo = await hexo.post.create({ title: title, layout: "page" });
  return getNewPage(newPageInfo.path);
}

async function deletePage(id) {
  const currentPage = await getSinglePage(id);
  await fs.unlinkSync(currentPage.full_source);
  const pagePath = path.dirname(currentPage.full_source);
  const pageFiles = fs.readdirSync(pagePath);
  if (pageFiles.length === 0) {
    await fs.rmdirSync(pagePath);
  }
  return "deleted";
}

module.exports = {
  setup: setup,
  getAll: getAllPages,
  getSingle: getSinglePage,
  save: save,
  updateContent: updateContent,
  delete: deletePage,
  create: create,
};
