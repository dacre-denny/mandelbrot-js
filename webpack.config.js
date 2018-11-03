var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js'
  },
  devtool: 'inline-source-map',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
};