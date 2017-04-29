var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');
var config = require('./webpack.base.config.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('./webpack/html-webpack-harddisk-plugin');

var host = '0.0.0.0';
var port = 3333;
var outputTemplatePath = path.resolve(__dirname, "../../templates/");

_.keys(config.entry).forEach(function (k) {
    config.entry[k].unshift(
        'webpack-dev-server/client?http://localhost:' + port,
        "webpack/hot/dev-server"
    );
});
config.output.publicPath = 'http://localhost:3333/assets/';
config.plugins = [
    // 有错误时停止生成文件
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("[name].[contenthash:5].css"),
    new HtmlWebpackPlugin({
        title: 'v2ex',
        filename: 'index.html',
        template: 'index.html',
        inject: true,
        alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin({
        outputDir: outputTemplatePath
    })
];

config.devtool = "#eval-source-map";
config.devServer = {
    contentBase: __dirname,
    historyApiFallback: true,
    stats: 'errors-only',
    hot: true,
    debug: true,
    profile: true,
    colors: true,
    host: host,
    port: port,
    console: false,
    global: true,
    process: true,
    Buffer: true
};
module.exports = config;