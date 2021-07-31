const path = require('path');
const { DefinePlugin } = require('webpack');
const RemovePlugin = require('remove-files-webpack-plugin');
const packageDotJson = require('./package.json');

const OUTPUT_DIR = 'lib';

enum Asset {
  index = 'index',
  generateHeadTags = 'generateHeadTags',
  generateRobotsTxt = 'generateRobotsTxt',
  generateSitemapXml = 'generateSitemapXml',
}

// https://itnext.io/how-to-build-and-publish-npm-packages-with-webpack-dea19bb14627
// https://medium.com/@jdxcode/for-the-love-of-god-dont-use-npmignore-f93c08909d8d
module.exports = {
  entry: {
    [Asset.index]: `./src/${Asset.index}.ts`,
    [Asset.generateHeadTags]: `./src/${Asset.generateHeadTags}.tsx`,
    [Asset.generateRobotsTxt]: `./src/${Asset.generateRobotsTxt}.ts`,
    [Asset.generateSitemapXml]: `./src/${Asset.generateSitemapXml}.ts`,
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
    path: path.resolve(__dirname, OUTPUT_DIR),
    filename: '[name].js',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
  },
  plugins: [
    new RemovePlugin({
      before: {
        include: [OUTPUT_DIR],
      },
      after: {
        test: [
          {
            folder: OUTPUT_DIR,
            method: (filePath: string) => filePath.match(/\.(spec|test)\./),
          },
        ],
      },
    }),
    new DefinePlugin({
      PACKAGE_DOT_JSON_VERSION: JSON.stringify(packageDotJson.version),
    }),
  ],
  optimization: {
    minimize: true,
  },
  performance: {
    hints: 'error',
    maxAssetSize: 10_000, // 10 kiB
    assetFilter: (filePath: string) => {
      const browserAssets = [Asset.generateHeadTags];
      return browserAssets.some((browserAsset) => filePath.includes(browserAsset));
    },
  },
};
