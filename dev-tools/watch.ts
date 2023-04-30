import chokidar from "chokidar";
const fs = require("fs-extra");

//Admin API
const bridgeLocation = "../dev-blog/node_modules/hexo-bridge/";
const bridgeApiDevLocation = "../bridge-admin-api/";
let adminApiWatcher = chokidar.watch(bridgeApiDevLocation, { ignoreInitial: true, persistent: true });
adminApiWatcher.on("all", (event, path) => {
  console.log(event, path);
  fs.copySync(path, path.replace(bridgeApiDevLocation, bridgeLocation));
});

//Web Client
const bridgeClientDevLocation = "../bridge-client/";
const bridgeClientLocation = bridgeLocation + "www/";
let clientApiWatcher = chokidar.watch(bridgeClientDevLocation, {
  ignoreInitial: true,
  persistent: true,
  ignored: /src\/.*|(node_modules\/.*)/,
});

clientApiWatcher.on("all", (event, path) => {
  if (path.includes("/build") && (event === "add" || event === "addDir" || event === "change")) {
    console.log(event, path);
    fs.copySync(path, path.replace(bridgeClientDevLocation + "build/", bridgeClientLocation));
  }
});

console.log("Watching for changes...");
