/**
 * @file Webpack config for compiling the app server.
 */

import path from 'path';
import { BannerPlugin, Configuration, DefinePlugin, EnvironmentPlugin, Plugin, WatchIgnorePlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import nodeExternals from 'webpack-node-externals';
import buildConf from './build.conf';
import { getLocaleDataFromDir, getTranslationDataDictFromDir } from './utils';

const isProduction = process.env.NODE_ENV === 'production';
const cwd = path.join(__dirname, '../');
const inputDir = path.join(cwd, 'src');
const outputDir = path.join(cwd, 'build');
const useBundleAnalyzer = isProduction && buildConf.build.analyzer;

const config: Configuration = {
  devtool: isProduction ? (buildConf.build.sourceMap ? 'source-map' : false) : 'source-map',
  entry: {
    server: path.join(inputDir, 'server.tsx'),
  },
  externals: [nodeExternals()],
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.tsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      }],
    }, {
      test: /\.(jpe?g|png|gif|svg)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192,
          emitFile: false,
          name: `assets/images/[name]${isProduction ? '.[hash:6]' : ''}.[ext]`,
        },
      }, {
        loader: 'image-webpack-loader',
        options: {
          disable: !isProduction,
         },
      }],
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192,
          emitFile: false,
          name: `assets/media/[name]${isProduction ? '.[hash:6]' : ''}.[ext]`,
        },
      }],
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192,
          emitFile: false,
          name: `assets/fonts/[name]${isProduction ? '.[hash:6]' : ''}.[ext]`,
        },
      }],
    }],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    filename: '[name].js',
    path: outputDir,
    publicPath: buildConf.build.publicPath,
    sourceMapFilename: '[name].js.map',
    libraryTarget: 'commonjs2',
    globalObject: 'this', // https://github.com/webpack/webpack/issues/6642#issuecomment-371087342
  },
  performance: {
    hints: isProduction ? 'warning' : false,
  },
  plugins: [
    new DefinePlugin({
      __BUILD_CONFIG__: JSON.stringify(buildConf),
      __APP_ENV__: JSON.stringify('server'),
      __ASSET_MANIFEST__: JSON.stringify((() => {
        let t;

        if (process.env.NODE_ENV === 'production') {
          try { t = require(path.join(__dirname, '../build/static/asset-manifest.json')); }
          catch (err) { /* Do nothing */ }
        }

        return t;
      })()),
      __INTL_CONFIG__: JSON.stringify({
        defaultLocale: buildConf.locales[0],
        localeData: getLocaleDataFromDir(path.join(cwd, 'config/locales')),
        locales: buildConf.locales,
        dict: getTranslationDataDictFromDir(path.join(cwd, 'config/locales')),
      }),
    }),
    new EnvironmentPlugin(['NODE_ENV']),
    ...!useBundleAnalyzer ? [] : [
      new BundleAnalyzerPlugin(),
    ],
    ...isProduction ? [] : [
      new WatchIgnorePlugin([
        /containers/,
        /components/,
      ]),
    ],
    ...!buildConf.build.sourceMap ? [] : [
      new BannerPlugin({
        banner: "require('source-map-support').install();",
        raw: true,
        entryOnly: false,
      }),
    ],
  ] as Array<Plugin>,
  resolve: {
    alias: {
      ...isProduction ? {} : {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  stats: {
    colors: true,
    errorDetails: true,
    modules: true,
    reasons: true,
  },
  target: 'node',
};

export default config;
