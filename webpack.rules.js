/* eslint-disable import/unambiguous */

const isDev = process.env.npm_lifecycle_event === "start";

module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/u,
    use: "node-loader",
  },
  {
    parser: {amd: false},
    test: /\.(m?js|node)$/u,
    use: {
      loader: "@marshallofsound/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  {
    exclude: /(node_modules|\.webpack)/u,
    test: /\.tsx?$/u,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
        ...isDev ? {} : {configFile: "tsconfig.prod.json"},
      },
    },
  },
  {
    exclude: /(node_modules|\.webpack)/u,
    test: /\.[jt]sx$/u,
    use: [
      {
        loader: "babel-loader",
        options: {
          plugins: isDev ? ["react-refresh/babel"] : [],
        },
      },
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          ...isDev ? {} : {configFile: "tsconfig.prod.json"},
        },
      },
    ],
  },
];
