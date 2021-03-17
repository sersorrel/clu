const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

const isDev = process.env.npm_lifecycle_event === 'start';

rules.push({
  test: /\.css$/,
  use: [{ loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader }, { loader: 'css-loader' }],
});

module.exports = {
  mode: isDev ? 'development' : 'production',
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
};
