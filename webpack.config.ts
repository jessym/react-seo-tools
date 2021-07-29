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

const browserAssets = Object.values(Asset).filter((asset) => {
  const mapping: Record<Asset, boolean> = {
    [Asset.index]: false,
    [Asset.generateHeadTags]: true,
    [Asset.generateRobotsTxt]: false,
    [Asset.generateSitemapXml]: false,
  };
  return mapping[asset];
});

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
  optimization: {
    minimize: false,
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
      BUILD_PACKAGE_VERSION: JSON.stringify(packageDotJson.version),
    }),
  ],
  performance: {
    hints: 'error',
    maxAssetSize: 15000, // 15 kiB
    assetFilter: (filePath: string) => browserAssets.some((browserAsset) => filePath.includes(browserAsset)),
  },
};
