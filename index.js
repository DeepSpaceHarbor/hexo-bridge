const bodyParser = require("body-parser");
const toJson = require("./utils.js").toJson;
const serveClientFiles = require("./utils.js").serveClientFiles;
const path = require("path");
var serveStatic = require("serve-static");

const posts = require("./post.js");
const pages = require("./page.js");
const assets = require("./asset.js");
const scaffolds = require("./scaffold.js");
const settings = require("./setting.js");
const plugins = require("./plugin.js");
const themes = require("./theme.js");

function setupHelpers(req, res, next) {
  res.sendSuccess = (data) => {
    res.end(toJson(data));
  };
  res.sendError = (errorMessage) => {
    res.statusCode = 400;
    res.end(toJson({ error: errorMessage }));
  };
  next();
}

hexo.extend.filter.register("server_middleware", (app) => {
  app.use(hexo.config.root + "api/", bodyParser.urlencoded({ limit: "500mb", extended: true }));
  app.use(setupHelpers);
  posts.setup(hexo);
  pages.setup(hexo);
  assets.setup(hexo);
  scaffolds.setup(hexo);
  settings.setup(hexo);
  plugins.setup(hexo);
  themes.setup(hexo);

  //Serve files from the client web app
  app.use(hexo.config.root + "bridge/static/", serveStatic(path.join(__dirname, "www/static")));
  app.use(hexo.config.root + "bridge/", serveClientFiles);

  //API:MISC
  app.use(hexo.config.root + "api/render", function (req, res) {
    res.sendSuccess(hexo.render.renderSync({ text: req.body.text, engine: "markdown" }));
  });

  //API:POSTS
  app.use(hexo.config.root + "api/posts/getAll", function (req, res) {
    res.sendSuccess(posts.getAll());
  });

  app.use(hexo.config.root + "api/posts/getSingle", async function (req, res) {
    try {
      const post = await posts.getSingle(req.body.id);
      res.sendSuccess(post);
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/posts/draft", async function (req, res) {
    try {
      const post = await posts.unpublish(req.body.id);
      res.sendSuccess(post);
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/posts/publish", async function (req, res) {
    try {
      const post = await posts.publish(req.body.id);
      res.sendSuccess(post);
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/posts/save", async function (req, res) {
    try {
      const result = await posts.save(req.body.id, req.body.content);
      res.sendSuccess(result);
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/posts/updateContent", async function (req, res) {
    try {
      const result = await posts.updateContent(req.body.id, req.body.content);
      res.sendSuccess(result);
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/posts/create", async function (req, res) {
    try {
      const post = await posts.create(req.body.title, req.body.scaffold);
      res.sendSuccess(post);
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/posts/delete", async function (req, res) {
    try {
      const result = await posts.delete(req.body.id);
      res.sendSuccess(result);
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  //API:ASSETS
  app.use(hexo.config.root + "api/assets/upload", assets.upload);

  app.use(hexo.config.root + "api/assets/getAll", async function (req, res) {
    try {
      res.sendSuccess(assets.listDirectory(req.body.directory));
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/assets/createDirectory", function (req, res) {
    try {
      assets.createDirectory(req.body.directory);
      res.sendSuccess("Created!");
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/assets/deleteDirectory", function (req, res) {
    try {
      assets.deleteDirectory(req.body.directory);
      res.sendSuccess("Deleted!");
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/assets/deleteFile", function (req, res) {
    try {
      assets.deleteFile(req.body.filePath);
      res.sendSuccess("Deleted!");
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/assets/rename", function (req, res) {
    try {
      assets.rename(req.body.oldPath, req.body.newPath);
      res.sendSuccess("Renamed!");
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  //API:PAGES
  app.use(hexo.config.root + "api/pages/getAll", function (req, res) {
    res.sendSuccess(pages.getAll());
  });

  app.use(hexo.config.root + "api/pages/getSingle", async function (req, res) {
    try {
      const page = await pages.getSingle(req.body.id);
      res.sendSuccess(page);
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/pages/save", async function (req, res) {
    try {
      const result = await pages.save(req.body.id, req.body.content);
      res.sendSuccess(result);
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/pages/updateContent", async function (req, res) {
    try {
      const result = await pages.updateContent(req.body.id, req.body.content);
      res.sendSuccess(result);
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/pages/create", async function (req, res) {
    try {
      const page = await pages.create(req.body.title);
      res.sendSuccess(page);
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/pages/delete", async function (req, res) {
    try {
      const result = await pages.delete(req.body.id);
      res.sendSuccess(result);
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  //API:SCAFFOLDS
  app.use(hexo.config.root + "api/scaffolds/getAllNames", function (req, res) {
    res.sendSuccess(scaffolds.getNames());
  });

  app.use(hexo.config.root + "api/scaffolds/getAllData", function (req, res) {
    res.sendSuccess(scaffolds.getAllData());
  });

  app.use(hexo.config.root + "api/scaffolds/create", function (req, res) {
    try {
      scaffolds.create(req.body.name);
      res.sendSuccess("Created!");
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/scaffolds/save", function (req, res) {
    try {
      scaffolds.update(req.body.name, req.body.content);
      res.sendSuccess("Saved!");
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/scaffolds/rename", function (req, res) {
    try {
      scaffolds.rename(req.body.name, req.body.newName);
      res.sendSuccess("Renamed!");
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/scaffolds/delete", function (req, res) {
    try {
      scaffolds.delete(req.body.name);
      res.sendSuccess("Deleted!");
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  //API:SETTINGS
  app.use(hexo.config.root + "api/settings/hexo/get", function (req, res) {
    res.sendSuccess(settings.getHexoConfig());
  });

  app.use(hexo.config.root + "api/settings/hexo/save", function (req, res) {
    try {
      settings.saveHexoConfig(req.body.config);
      res.sendSuccess("Saved!");
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/settings/bridge/get", function (req, res) {
    res.sendSuccess(settings.getBridgeConfig());
  });

  app.use(hexo.config.root + "api/settings/bridge/getAsJson", function (req, res) {
    res.sendSuccess(settings.getBridgeConfigAsJson());
  });

  app.use(hexo.config.root + "api/settings/bridge/save", function (req, res) {
    try {
      settings.saveBridgeConfig(req.body.config);
      res.sendSuccess("Saved!");
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });

  app.use(hexo.config.root + "api/settings/validateYaml", function (req, res) {
    res.sendSuccess(settings.validate(req.body.config));
  });

  //API:PLUGINS
  app.use(hexo.config.root + "api/plugins/getAll", function (req, res) {
    res.sendSuccess(plugins.getAll());
  });

  app.use(hexo.config.root + "api/plugins/getInstalled", function (req, res) {
    res.sendSuccess(plugins.getInstalled());
  });

  app.use(hexo.config.root + "api/plugins/getScripts", function (req, res) {
    res.sendSuccess(plugins.getScripts());
  });

  //API:THEMES
  app.use(hexo.config.root + "api/theme/getAll", function (req, res) {
    res.sendSuccess(themes.getAll());
  });

  app.use(hexo.config.root + "api/theme/getInstalled", function (req, res) {
    res.sendSuccess(themes.getInstalled());
  });

  app.use(hexo.config.root + "api/theme/getConfig", function (req, res) {
    res.sendSuccess(themes.getConfig());
  });

  app.use(hexo.config.root + "api/theme/saveConfig", function (req, res) {
    try {
      themes.saveConfig(req.body.config);
      res.sendSuccess("Saved!");
    } catch (error) {
      console.error(error);
      res.sendError("Sorry, something went wrong.");
    }
  });
});
