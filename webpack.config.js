const path = require('path')
const webpack = require('webpack')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: path.join(__dirname, 'main.js'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[basename].js?[chunkhash]',
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  mode: 'development',
  target:"electron-renderer",
  module: {
    rules: [
      {
        test: /\.vue$/,
        include: [
          path.resolve(__dirname, "components"),
        ],
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        include: [
          path.join(__dirname,'main.js'),
        ],
        use: 'babel-loader',
      },
      {
        test: /\.css/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test:/\.(eot|woff2|woff|ttf|svg)/,
        use:[
            {
              loader:'file-loader',
            }
        ]
      }
    ],
  },

  // // 代码模块路径解析的配置
  // resolve: {
  //   modules: [
  //     "node_modules",
  //     path.resolve(__dirname, 'src')
  //   ],

  //   extensions: [".wasm", ".mjs", ".js", ".json", ".jsx"],
  // },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'app.html', // 配置输出文件名和路径
      template: 'app.html', // 配置文件模板
      inject: true,
    }),
    new MiniCssExtractPlugin(),
    // 使用 uglifyjs-webpack-plugin 来压缩 JS 代码
    //new UglifyPlugin(),
    new webpack.ProvidePlugin({
      "$": "jquery",
      "jQuery": "jquery",
      "window.jQuery": "jquery"
    }),
    new VueLoaderPlugin()
  ],
}