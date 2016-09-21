'use strict';

var path = require('path');
var webpack = require('webpack');
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
// var htmlWebpackPlugin =  require('html-webpack-plugin');
//
var CopyWebpackPlugin = require("copy-webpack-plugin");

var Dashboard = require("webpack-dashboard");
var DashboardPlugin = require("webpack-dashboard/plugin");
var dashboard = new Dashboard();

module.exports = {
  entry: [
    'webpack/hot/only-dev-server',
    "./app/index.js"
  ],
  output: {
    path: BUILD_PATH,
    filename: "bundle.js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      query: {
        presets:['react','es2015']
      }
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass'],
      include: APP_PATH
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url?limit=40000'
    }]
  },
  resolve:{
    extensions:['','.js','.json']
  },
  devServer: {
    hot: true,
    inline: true
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: ROOT_PATH + "/app/static"},
      {from: ROOT_PATH + "/manifest.json"},
      {from: ROOT_PATH + "/index.html"}
    ], ROOT_PATH + "/build"),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin(dashboard.setData)
  ]
};
