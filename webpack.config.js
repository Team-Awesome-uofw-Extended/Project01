module.exports = {
  entry: ["babel-polyfill", "./index.js"],
  output: {
    path: __dirname,
    filename: "bundle.js",
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
