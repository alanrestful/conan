"use strict";

var path = require("path");
var webpack = require("webpack");
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, "app");
var BUILD_PATH = path.resolve(ROOT_PATH, "build");

var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: [
    "./app/app.js"
  ],
  output: {
    path: BUILD_PATH + "/assest/",
    filename: "bundle.js",
    publicPath: "/assest/"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules|scripts\/(background|content|jquery\.min|prism)\.js/,
      loader: "babel-loader",
      query: {
        presets: ["react", "es2015", "stage-2"],
        plugins: ["transform-decorators-legacy", ["import", {
          style: "css",
          libraryName: "antd"
        }]]
      }
    }, {
      test: /\.(scss|css)$/,
      loaders: ["style", "css", "sass"]
    }, {
      test: /\.(png|jpg)$/,
      loader: "url?limit=40000"
    }]
  },
  resolve: {
    root: [
      path.resolve(APP_PATH),
      path.resolve(APP_PATH + "/components/"),
      path.resolve(APP_PATH + "/reducers/"),
      path.resolve(APP_PATH + "/static/")
    ],
    extensions: ["", ".js"]
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: APP_PATH + "/static/", to: BUILD_PATH + "/assest/"},
      {from: ROOT_PATH + "/manifest.json", to: BUILD_PATH},
      {from: ROOT_PATH + "/index.html", to: BUILD_PATH}
    ], {
      ignore: [
        "helpers.js",
        "util.js",
        "*.scss"
      ]}
    ),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.DedupePlugin()
  ]
};
