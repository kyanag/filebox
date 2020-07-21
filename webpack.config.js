const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")


module.exports = {
  entry: path.join(__dirname,'app.js'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  node: {
    fs: 'empty',
    net:'empty',
    tls:"empty",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.join(__dirname,'app.js'),
          path.resolve(__dirname, 'src')
        ],
        use: 'babel-loader',
      },
      {
        test: /\.css/,
        include: [
          path.resolve(__dirname, 'style'),
        ],
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
          'css-loader',
          'sass-loader'
        ]
      },
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
      filename: 'index.html', // 配置输出文件名和路径
      template: 'index.html', // 配置文件模板
      minify: false
    }),
    new MiniCssExtractPlugin(),
    // 使用 uglifyjs-webpack-plugin 来压缩 JS 代码
    //new UglifyPlugin()
  ]
}