/* eslint-disable import/unambiguous */

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const plugins = require("./webpack.plugins");
const rules = require("./webpack.rules");

const isDev = process.env.npm_lifecycle_event === "start";

rules.push({
  test: /\.css$/u,
  use: [{loader: isDev ? "style-loader" : MiniCssExtractPlugin.loader}, {loader: "css-loader"}],
});

module.exports = {
  mode: isDev ? "development" : "production",
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
