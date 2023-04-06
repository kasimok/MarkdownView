// 引入所需的依赖包：
const webpack = require('webpack');
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// 设置配置对象：通过设置module.exports，我们可以将配置对象导出，以便在运行 webpack 时使用。
module.exports = {
    mode: 'production', // 配置模式: 设置模式为production，这将启用 webpack 的一些内置优化功能，例如压缩和代码分割。
    entry: __dirname + "/src/js/index.js", // 配置输入: entry属性定义了项目的入口文件，webpack 从此文件开始构建。
    output: {
        path: __dirname + '/../Sources/MarkdownView/Resources',
        filename: 'main.js'
    }, // 配置输出: output属性定义了构建后的文件位置和名称。
    module: {
        rules: [ // 在这部分，我们定义了构建过程中应用的规则。针对不同类型的文件（例如.js，.css，图像和字体文件），我们可以应用不同的 loader。
            {
                test: /\.js$/,
                loader: "babel-loader"
            }, {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }, {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]"
                }
            }
        ]
    },
    plugins: [ // 添加插件（plugins）用于处理CSS和压缩代码：
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new webpack.LoaderOptionsPlugin({minimize: true})
    ],
    // 配置优化（optimization）选项，压缩JavaScript和CSS代码：
    optimization: {
    usedExports: false, // Add this line to disable tree shaking
        minimize: true,
        // 使用TerserPlugin和CssMinimizerPlugin插件进行代码压缩：
        minimizer: [
            new TerserPlugin({
                extractComments: 'all',
                terserOptions: {
                    compress: true,
                    output: {
                      comments: false,
                      beautify: false
                    }
                }
            }),
            new CssMinimizerPlugin({
                minimizerOptions: {
                  preset: [
                    'default',
                    {
                      discardComments: { removeAll: true },
                    },
                  ],
                },
              }),
        ],
    }
}
