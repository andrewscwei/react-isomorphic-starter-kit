/**
 * @file Webpack config for compiling the app server.
 */

import path from 'path'
import { BannerPlugin, Configuration, DefinePlugin, EnvironmentPlugin, WatchIgnorePlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import nodeExternals from 'webpack-node-externals'
import buildConf from './build.conf'
import { getTranslationDataDictFromDir } from './utils'

const isProduction = process.env.NODE_ENV === 'production'
const cwd = path.join(__dirname, '../')
const inputDir = path.join(cwd, 'src')
const outputDir = path.join(cwd, 'build')
const useBundleAnalyzer = isProduction && buildConf.build.analyzer
const useSpeedMeasurer = buildConf.build.speed

const config: Configuration = {
  devtool: isProduction ? (buildConf.build.sourceMap ? 'source-map' : false) : 'source-map',
  entry: {
    index: path.join(inputDir, 'index.ts'),
  },
  externals: [nodeExternals() as any],
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
          emitFile: false,
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
          emitFile: false,
          esModule: false,
          limit: 8192,
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
    libraryTarget: 'commonjs2',
    path: outputDir,
    publicPath: buildConf.build.publicPath,
    sourceMapFilename: '[name].js.map',
  },
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 1 * 1024 * 1024,
    maxAssetSize: 1 * 1024 * 1024,
  },
  plugins: [
    new DefinePlugin({
      __BUILD_CONFIG__: JSON.stringify(buildConf),
      __ASSET_MANIFEST__: JSON.stringify((() => {
        let t

        if (process.env.NODE_ENV === 'production') {
          try { t = require(path.join(__dirname, '../build/static/asset-manifest.json')) }
          catch (err) { /* Do nothing */ }
        }

        return t
      })()),
      __I18N_CONFIG__: JSON.stringify({
        defaultLocale: buildConf.locales[0],
        locales: buildConf.locales,
        dict: getTranslationDataDictFromDir(path.join(cwd, 'config/locales')),
      }),
    }),
    new EnvironmentPlugin({
      NODE_ENV: 'development',
      APP_ENV: 'server',
    }),
    ...!useBundleAnalyzer ? [] : [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    ],
    ...isProduction ? [] : [
      new WatchIgnorePlugin({
        paths: [
          /bundles/,
          /containers/,
          /components/,
        ],
      }),
    ],
    ...!buildConf.build.sourceMap ? [] : [
      new BannerPlugin({
        banner: "require('source-map-support').install();",
        raw: true,
        entryOnly: false,
      }),
    ],
  ],
  resolve: {
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
  target: 'node',
}

export default useSpeedMeasurer ? (new (require('speed-measure-webpack-plugin'))()).wrap(config) : config
