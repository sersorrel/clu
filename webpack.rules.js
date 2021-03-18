const isDev = process.env.npm_lifecycle_event === 'start';

module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@marshallofsound/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        ...(isDev ? {} : {configFile: 'tsconfig.prod.json'}),
      }
    }
  },
  {
    test: /\.[jt]sx$/,
    exclude: /(node_modules|\.webpack)/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          plugins: isDev ? ['react-refresh/babel'] : [],
        },
      },
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          ...(isDev ? {} : {configFile: 'tsconfig.prod.json'}),
        }
      }
    ],
  }
];
