const path = require('path');
const { DefinePlugin } = require('webpack');
const RemovePlugin = require('remove-files-webpack-plugin');
const packageDotJson = require('./package.json');

// https://itnext.io/how-to-build-and-publish-npm-packages-with-webpack-dea19bb14627
// https://medium.com/@jdxcode/for-the-love-of-god-dont-use-npmignore-f93c08909d8d
module.exports = {
  entry: {
    index: './src/index.ts',
    generateHeadTags: './src/generateHeadTags.tsx',
    generateRobotsTxt: './src/generateRobotsTxt.ts',
    generateSitemapXml: './src/generateSitemapXml.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new RemovePlugin({
      before: {
        include: ['./lib'],
      },
      after: {
        test: [
          {
            folder: './lib',
            method: (filePath) => filePath.match(/\.(spec|test)\./),
          },
        ],
      },
    }),
    new DefinePlugin({
      BUILD_PACKAGE_VERSION: JSON.stringify(packageDotJson.version),
    }),
  ],
};
