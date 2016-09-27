"use strict";

var path = require("path");
var webpack = require("webpack");
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, "app");
var BUILD_PATH = path.resolve(ROOT_PATH, "build");
var htmlWebpackPlugin =  require("html-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: [
    "./app/index.js"
  ],
  output: {
    path: BUILD_PATH + "/assest/",
    filename: "bundle.js",
    publicPath: "/assest/"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      query: {
        presets: ["react", "es2015", "stage-2"],
        plugins: [["import", {
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
    root: APP_PATH,
    extensions: ["", ".js", ".json"]
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: APP_PATH + "/static/scripts/", to: BUILD_PATH + "/assest/scripts/"},
      {from: APP_PATH + "/static/images/", to: BUILD_PATH + "/assest/images/"},
      {from: APP_PATH + "/static/styles/", to: BUILD_PATH + "/assest/styles/"},
      {from: ROOT_PATH + "/manifest.json", to: BUILD_PATH},
      {from: ROOT_PATH + "/index.html", to: BUILD_PATH}
    ], {
      ignore: [
        "helpers.js"
      ]}
    ),
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.NoErrorsPlugin(),
    new htmlWebpackPlugin()
  ]
};