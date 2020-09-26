const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  context: __dirname,

  target: 'node',

  mode: 'production',

  node: {
    __filename: false,
    __dirname: false,
  },

  entry: {
    extension: './src/extension.ts',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },

  externals: {
    vscode: 'commonjs vscode',
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    ],
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  plugins: [
    // Copy files to dist folder where the runtime can find them
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([]),
  ],
};
