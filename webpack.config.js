var HtmlWebpackPlugin = require("html-webpack-plugin");
var path = require("path");

module.exports = {
  entry: {
    app: path.join(__dirname, "src", "app.js")
  },
  devtool: "inline-source-map",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "mandelbrot",
      template: "src/index.html"
    })
  ],
  resolve: {
    extensions: [".js", ".html"]
  }
};
