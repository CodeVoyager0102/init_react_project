const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        // REACT_APP_WECHAT_APP_ID: JSON.stringify(process.env.REACT_APP_WECHAT_APP_ID),
        // REACT_APP_WECHAT_APP_SECRET: JSON.stringify(process.env.REACT_APP_WECHAT_APP_SECRET),
        // REACT_APP_QQ_APP_ID: JSON.stringify(process.env.REACT_APP_QQ_APP_ID),
        // REACT_APP_QQ_APP_SECRET: JSON.stringify(process.env.REACT_APP_QQ_APP_SECRET),
        // REACT_APP_WEIBO_APP_ID: JSON.stringify(process.env.REACT_APP_WEIBO_APP_ID),
        // REACT_APP_WEIBO_APP_SECRET: JSON.stringify(process.env.REACT_APP_WEIBO_APP_SECRET),
      },
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3005,
    hot: true,
    open: true,
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "fs": false,
      "path": false,
      "os": false,
      "crypto": false,
      "stream": false,
      "http": false,
      "https": false,
      "zlib": false,
      "url": false,
      "util": false,
      "assert": false,
      "buffer": false,
      "querystring": false,
      "net": false,
      "tls": false,
      "dns": false,
      "child_process": false,
      "dgram": false,
      "cluster": false,
      "worker_threads": false,
      "readline": false,
      "repl": false,
      "vm": false,
      "perf_hooks": false,
      "inspector": false,
      "async_hooks": false,
      "string_decoder": false,
      "punycode": false,
      "domain": false,
      "constants": false,
      "events": false,
      "querystring-es3": false,
      "process": false
    }
  }
}; 