const webpack = require("webpack");
const jquery = require("jquery");

module.exports = {
  entry: ["babel-polyfill", "./index.js", "./assets/js/firebase.js"],
  output: {
    library: "indexJS",
    libraryTarget: "umd",
    path: __dirname,
    filename: "bundle.js",
    globalObject: "this",
  },
  module: {
    rules: [
      { test: /\.css$/, use: "css-loader" },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/transform-runtime"],
          },
        },
      },
    ],
  },
};
