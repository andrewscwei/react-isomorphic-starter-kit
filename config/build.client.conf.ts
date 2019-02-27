/**
 * @file Webpack config for compiling the app client.
 */

import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import { Configuration, DefinePlugin, EnvironmentPlugin, HotModuleReplacementPlugin, IgnorePlugin, NamedModulesPlugin, Plugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ManifestPlugin from 'webpack-manifest-plugin';
import buildConf from './build.conf';
import { getLocaleDataFromDir, getTranslationDataDictFromDir } from './utils';

const isProduction = process.env.NODE_ENV === 'production';
const cwd = path.join(__dirname, '../');
const inputDir = path.join(cwd, 'src');
const outputDir = path.join(cwd, 'build/static');
const useBundleAnalyzer = isProduction && buildConf.build.analyzer;

const config: Configuration = {
  devtool: isProduction ? (buildConf.build.sourceMap ? 'source-map' : false) : 'cheap-eval-source-map',
  entry: {
    bundle: [
      ...isProduction ? [] : ['webpack-hot-middleware/client?reload=true'],
      path.join(inputDir, 'client.tsx'),
    ],
  },
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.tsx?$/,
      use: 'babel-loader?cacheDirectory',
    }, {
      test: /\.(jpe?g|png|gif|svg)(\?.*)?$/,
      loaders: [
        `url-loader?limit=8192&name=assets/images/[name]${isProduction ? '.[hash:6]' : ''}.[ext]`,
        `image-webpack-loader?${isProduction ? '' : 'disable'}`,
      ],
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: `url-loader?limit=8192&name=assets/media/[name]${isProduction ? '.[hash:6]' : ''}.[ext]`,
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: `url-loader?limit=8192&name=assets/fonts/[name]${isProduction ? '.[hash:6]' : ''}.[ext]`,
    }],
  },
  output: {
    path: outputDir,
    publicPath: buildConf.build.publicPath,
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    sourceMapFilename: '[file].map',
  },
  performance: {
    hints: isProduction ? 'warning' : false,
  },
  plugins: [
    new CopyPlugin([{ from: path.join(inputDir, 'static'), ignore: ['.*'], to: outputDir }]),
    new DefinePlugin({
      __BUILD_CONFIG__: JSON.stringify(buildConf),
      __APP_ENV__: JSON.stringify('client'),
    }),
    new EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    ...isProduction ? [
      new IgnorePlugin(/^.*\/config\/.*$/),
      new ManifestPlugin({ fileName: 'asset-manifest.json' }),
      new DefinePlugin({
        __INTL_CONFIG__: JSON.stringify({
          defaultLocale: buildConf.locales[0],
          localeData: getLocaleDataFromDir(path.join(cwd, 'config/locales')),
          locales: buildConf.locales,
          dict: getTranslationDataDictFromDir(path.join(cwd, 'config/locales')),
        }),
      }),
    ] : [
      new HotModuleReplacementPlugin(),
      new NamedModulesPlugin(),
    ],
    ...!useBundleAnalyzer ? [] : [
      new BundleAnalyzerPlugin(),
    ],
  ] as Array<Plugin>,
  resolve: {
    alias: {
      '@': inputDir,
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
  target: 'web',
};

export default config;
