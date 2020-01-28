/**
 * @file Webpack config for compiling the app client.
 */

import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import { DefinePlugin, EnvironmentPlugin, HotModuleReplacementPlugin, IgnorePlugin, NamedModulesPlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ManifestPlugin from 'webpack-manifest-plugin';
import buildConf from './build.conf';
import { getTranslationDataDictFromDir } from './utils';

const isProduction = process.env.NODE_ENV === 'production';
const cwd = path.join(__dirname, '../');
const inputDir = path.join(cwd, 'src');
const outputDir = path.join(cwd, 'build/static');
const useBundleAnalyzer = isProduction && buildConf.build.analyzer;

const config = {
  devtool: isProduction ? (buildConf.build.sourceMap ? 'source-map' : false) : 'cheap-eval-source-map',
  entry: {
    bundle: [
      ...isProduction ? [] : ['webpack-hot-middleware/client?reload=true'],
      path.join(inputDir, 'client.jsx'),
    ],
    polyfills: path.join(inputDir, 'polyfills.jsx'),
  },
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.jsx?$/,
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
          esModule: false,
          limit: 8192,
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
          esModule: false,
          limit: 8192,
          name: `assets/media/[name]${isProduction ? '.[hash:6]' : ''}.[ext]`,
        },
      }],
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: 8192,
          name: `assets/fonts/[name]${isProduction ? '.[hash:6]' : ''}.[ext]`,
        },
      }],
    }],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          test: /node_modules/,
          chunks: 'all',
          name: 'common',
          enforce: true,
        },
      },
    },
  },
  output: {
    path: outputDir,
    publicPath: buildConf.build.publicPath,
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    sourceMapFilename: '[file].map',
    globalObject: 'this', // https://github.com/webpack/webpack/issues/6642#issuecomment-373244198
  },
  performance: {
    hints: isProduction ? 'warning' : false,
  },
  plugins: [
    new CopyPlugin([{ from: path.join(inputDir, 'static'), to: outputDir }]),
    new DefinePlugin({
      __BUILD_CONFIG__: JSON.stringify(buildConf),
      __APP_ENV__: JSON.stringify('client'),
      __I18N_CONFIG__: JSON.stringify({
        defaultLocale: buildConf.locales[0],
        locales: buildConf.locales,
        dict: getTranslationDataDictFromDir(path.join(cwd, 'config/locales')),
      }),
    }),
    new EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    ...isProduction ? [
      new IgnorePlugin(/^.*\/config\/.*$/),
      new ManifestPlugin({ fileName: 'asset-manifest.json' }),
    ] : [
      new HotModuleReplacementPlugin(),
      new NamedModulesPlugin(),
    ],
    ...!useBundleAnalyzer ? [] : [
      new BundleAnalyzerPlugin(),
    ],
  ],
  resolve: {
    alias: {
      ...isProduction ? {} : {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  stats: {
    colors: true,
    errorDetails: true,
    modules: true,
    reasons: true,
  },
  target: 'web',
};

export default config;
