const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlInlineCssWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const SriPlugin = require('webpack-subresource-integrity');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

const isDev = process.env.npm_lifecycle_event === 'start';

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new HtmlInlineCssWebpackPlugin(),
  new SriPlugin({
    hashFuncNames: ['sha256'],
  }),
  new CspHtmlWebpackPlugin({
    'script-src': isDev ? "'self'" : "",
    'style-src': isDev ? "'unsafe-inline'" : "",
  }, {
    nonceEnabled: {
      'script-src': false,
      'style-src': false,
    },
  }),
];
