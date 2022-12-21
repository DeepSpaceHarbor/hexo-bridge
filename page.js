const fs = require("hexo-fs");
const path = require("path");
const frontMatterHelper = require("hexo-front-matter");
const settings = require("./setting");

let hexo = null;
let Page = null;
let SOURCE_DIR = null;
let READ_TIMEOUT = 200;

function setup(hexoInstance) {
  hexo = hexoInstance;
  Page = hexo.model("Page");
  settings.setup(hexo);
  SOURCE_DIR = hexo.source_dir;
  READ_TIMEOUT = settings.getBridgeConfigAsJson().content_fetch_timeout || 200;
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

async function findNewPage(newPath, timeout = READ_TIMEOUT) {
  //TODO: Find a way to do this without setTimeout.
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve((newPage = Page.findOne({ source: newPath.split(SOURCE_DIR)[1] })));
    }, timeout);
  });
}

async function getNewPage(newPath) {
  let newPageReturnInfo = await findNewPage(newPath);
  //Search for the new page one more time. Sometimes it takes couple of ms for hexo to update the database.
  if (!newPageReturnInfo) {
    newPageReturnInfo = await findNewPage(newPath, READ_TIMEOUT + 200);
  }
  //If page is still not found, throw error.
  if (!newPageReturnInfo) {
    throw new Error("Sorry, I cannot find the newly created post.");
  }
  return newPageReturnInfo;
}

async function create(title) {
  const newPageInfo = await hexo.post.create({ title: title, layout: "page" });
  return await getNewPage(newPageInfo.path);
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
