const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('./webpack/html-webpack-harddisk-plugin');

const outputPath = path.resolve(__dirname, "./dist/");
const outputTemplatePath = path.resolve(__dirname, "../../templates/");
//const svgDirs = [
//  require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
//  // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 2. 自己私人的 svg 存放目录
//];

module.exports = {
    context: path.resolve(__dirname, "./"),
    entry: {
        'call-center': ['./src/setup.js']
    },

    resolve: {
        modulesDirectories: ['node_modules', path.join(__dirname, '../node_modules')],
        extensions: ['', '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'stage-0', 'stage-1', 'stage-2', 'stage-3'],
                    plugins: [
                        "transform-decorators-legacy",
                        [
                            "import",
                            {
                                "libraryName": "antd",
                                "style": "css"
                            }
                        ]
                    ]
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap')
            },
            {
                test: /\.sass$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!less?sourceMap')
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)(\?\S*)?$/,
                loader: 'file?name=/imgs/[name]-[hash:5].[ext]'
            }, {
                test: /\.(woff|woff2|ttf|eot)(\?\S*)?$/,
                loader: 'file?name=/fonts/[name]-[hash:5].[ext]'
            }, {
                test: /\.(mp4|mpeg|webm|ogv|swf)(\?\S*)?$/,
                loader: 'file?name=/video/[name]-[hash:5].[ext]'
            },
            //{
            //    test: /\.(svg)$/i,
            //    loader: 'svg-sprite',
            //    include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
            //},
        ]
    },
    output: {
        path: outputPath,
        publicPath: "/assets/",
        filename: "[name].[hash:5].js"
    },
    providePlugin: {
        _: 'lodash',
        $: 'jquery'
    },
    plugins: [
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
    ]
};
