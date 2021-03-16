const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlInlineCssWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const SriPlugin = require('webpack-subresource-integrity');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new HtmlInlineCssWebpackPlugin(),
  new SriPlugin({
    hashFuncNames: ['sha256'],
  }),
  new CspHtmlWebpackPlugin({
    'script-src': "",
    'style-src': "",
  }, {
    nonceEnabled: {
      'script-src': false,
      'style-src': false,
    },
  }),
];
