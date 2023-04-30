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
const bridgeClientDevLocation = "../bridge-client/build/";
const bridgeClientLocation = bridgeLocation + "www/";
let clientApiWatcher = chokidar.watch(bridgeClientDevLocation, { ignoreInitial: true, persistent: true });
clientApiWatcher.on("all", (event, path) => {
  console.log(event, path);
  fs.emptyDirSync(bridgeClientLocation);
  fs.moveSync(path, path.replace(bridgeClientDevLocation, bridgeClientLocation));
});

console.log("Watching for changes...");
