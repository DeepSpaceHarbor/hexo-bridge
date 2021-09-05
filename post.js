const fs = require("hexo-fs");
const path = require("path");

let hexo = null;
let Post = null;
let SOURCE_DIR = null;
let POSTS_DIR = null;
let DRAFTS_DIR = null;

function setup(hexoInstance) {
  hexo = hexoInstance;
  Post = hexo.model("Post");

  SOURCE_DIR = hexo.source_dir;
  POSTS_DIR = path.join(SOURCE_DIR, "_posts");
  DRAFTS_DIR = path.join(SOURCE_DIR, "_drafts");

  if (!fs.existsSync(DRAFTS_DIR)) {
    fs.mkdirsSync(DRAFTS_DIR);
  }

  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirsSync(POSTS_DIR);
  }
}

function getAllPosts() {
  return Post.toArray();
}

async function getSinglePost(id) {
  const currentPost = Post.get(id);
  if (currentPost) {
    return currentPost;
  } else {
    throw new Error("Invalid post id: " + id);
  }
}

async function getNewPost(newPath) {
  //TODO: Find a way to do this without setTimeout.
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve((newPost = Post.findOne({ source: newPath.split(SOURCE_DIR)[1] })));
    }, 3000);
  });
}

async function unpublish(id) {
  const currentPost = await getSinglePost(id);
  //Create old & new path
  const oldPath = currentPost.full_source;
  const fileName = path.basename(oldPath);
  const newPath = path.join(DRAFTS_DIR, fileName);
  // Rename & process the new changes
  fs.renameSync(oldPath, newPath);
  await hexo.source.process([SOURCE_DIR, POSTS_DIR, DRAFTS_DIR]);
  return await getNewPost(newPath);
}

async function publish(id) {
  const currentPost = await getSinglePost(id);
  //Create old & new path
  const oldPath = currentPost.full_source;
  const fileName = path.basename(oldPath);
  const newPath = path.join(POSTS_DIR, fileName);
  // Rename & process the new changes
  fs.renameSync(oldPath, newPath);
  await hexo.source.process([SOURCE_DIR, POSTS_DIR, DRAFTS_DIR]);
  return await getNewPost(newPath);
}

async function save(id, content) {
  const currentPost = await getSinglePost(id);
  const postPath = currentPost.full_source;
  await fs.writeFileSync(postPath, content);
  return "Success!";
}

async function create(title, scaffold) {
  const postParameters = { title: title, layout: scaffold };
  const newPostInfo = await hexo.post.create(postParameters);
  return await getNewPost(newPostInfo.path);
}

async function deletePost(id) {
  const currentPost = await getSinglePost(id);
  return await fs.unlinkSync(currentPost.full_source);
}

module.exports = {
  setup: setup,
  getAll: getAllPosts,
  getSingle: getSinglePost,
  unpublish: unpublish,
  publish: publish,
  save: save,
  create: create,
  delete: deletePost,
};
