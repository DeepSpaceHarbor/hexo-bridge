const path = require("path");
const fs = require("hexo-fs");

function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

function toJson(content) {
  return JSON.stringify(content, getCircularReplacer());
}

function toJsonFromHexo(content) {
  return JSON.stringify(content, function (k, v) {
    // tags and cats have posts reference resulting in circular json..
    if (k == "tags" || k == "categories") {
      // convert object to simple array
      return v.toArray
        ? v.toArray().map(function (obj) {
            return obj.name;
          })
        : v;
    }
    return v;
  });
}

function serveClientFiles(req, res) {
  let file = "";
  if (req.originalUrl.endsWith("/bridge")) {
    req.originalUrl += "/";
  }
  //Removes '/bridge/' from path. Formats the filename to the proper separator for the current os.
  let filePath = path.join(__dirname, "www", req.originalUrl.split("/bridge/")[1].split("/").join(path.sep));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    file = fs.readFileSync(filePath);
  } else {
    file = fs.readFileSync(path.join(__dirname, "www", "index.html"));
  }
  res.end(file, "utf-8");
}

module.exports = {
  toJson: toJson,
  toJsonFromHexo: toJsonFromHexo,
  serveClientFiles: serveClientFiles,
};
