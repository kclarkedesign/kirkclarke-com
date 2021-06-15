const path = require("path");
var webpack = require("webpack");
var pkg = require("./package.json");
var pkgPaths = pkg.config.paths;

module.exports = {
  entry: "./src/index.html",
  output: {
    filename: "index.html",
    path: path.resolve(__dirname, pkgPaths.dist),
  },
};
