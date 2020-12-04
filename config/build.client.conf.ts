/**
 * @file Webpack config for compiling the app client.
 */

import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import { Configuration, DefinePlugin, EnvironmentPlugin, HotModuleReplacementPlugin, IgnorePlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ManifestPlugin from 'webpack-manifest-plugin';
import buildConf from './build.conf';
import { getTranslationDataDictFromDir } from './utils';

const isProduction = process.env.NODE_ENV === 'production';
const cwd = path.join(__dirname, '../');
const inputDir = path.join(cwd, 'src');
const outputDir = path.join(cwd, 'build/static');
const useBundleAnalyzer = isProduction && buildConf.build.analyzer;

const config: Configuration = {
  devtool: isProduction ? (buildConf.build.sourceMap ? 'source-map' : false) : 'source-map',
  entry: {
    bundle: [
      ...isProduction ? [] : ['webpack-hot-middleware/client?reload=true'],
      path.join(inputDir, 'client.tsx'),
    ],
    polyfills: path.join(inputDir, 'polyfills.tsx'),
  },
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
    chunkFilename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    path: outputDir,
    publicPath: buildConf.build.publicPath,
    sourceMapFilename: '[file].map',
  },
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 512 * 1024,
    maxAssetSize: 512 * 1024,
  },
  plugins: [
    new CopyPlugin({
      patterns: [{
        from: path.join(inputDir, 'static'),
        to: outputDir,
      }],
    }),
    new DefinePlugin({
      __BUILD_CONFIG__: JSON.stringify(buildConf),
      __I18N_CONFIG__: JSON.stringify({
        defaultLocale: buildConf.locales[0],
        locales: buildConf.locales,
        dict: getTranslationDataDictFromDir(path.join(cwd, 'config/locales')),
      }),
    }),
    new EnvironmentPlugin({
      NODE_ENV: 'development',
      APP_ENV: 'client',
    }),
    ...isProduction ? [
      new IgnorePlugin({
        resourceRegExp: /^.*\/config\/.*$/,
      }),
      new ManifestPlugin({ fileName: 'asset-manifest.json' }) as any,
    ] : [
      new HotModuleReplacementPlugin(),
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
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  stats: {
    colors: true,
    errors: true,
    errorDetails: true,
    modules: true,
    moduleTrace: true,
    publicPath: true,
    reasons: true,
    timings: true,
  },
  target: 'web',
};

export default config;
