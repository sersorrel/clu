const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlInlineCssWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new HtmlInlineCssWebpackPlugin(),
  new CspHtmlWebpackPlugin({
    'script-src': "'self'",
    'style-src': "",
  }, {
    nonceEnabled: {
      'script-src': false,
      'style-src': false,
    },
  }),
];
