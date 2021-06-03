/* eslint-disable import/unambiguous */

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
// const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlInlineCssWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDev = process.env.npm_lifecycle_event === "start";

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  ...isDev ? [new ReactRefreshWebpackPlugin({
    overlay: {
      sockIntegration: "whm",
    },
  })] : [],
  new MiniCssExtractPlugin(),
  new HtmlInlineCssWebpackPlugin(),
  // new CspHtmlWebpackPlugin(
  //   {
  //     "script-src": isDev ? "'self'" : "",
  //     "style-src": isDev ? "'unsafe-inline'" : "",
  //   },
  //   {
  //     enabled: !isDev,
  //     nonceEnabled: {
  //       "script-src": false,
  //       "style-src": false,
  //     },
  //   },
  // ),
];
