const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new CspHtmlWebpackPlugin({
    'script-src': "'self'",
    'style-src': "'self' 'unsafe-inline'",
  }, {
    nonceEnabled: {
      'script-src': false,
      'style-src': false,
    },
  }),
];
