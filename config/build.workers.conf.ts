/**
 * @file Webpack config for compiling the server.
 */

import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import path from 'path'
import { BannerPlugin, Configuration, DefinePlugin, WatchIgnorePlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import nodeExternals from 'webpack-node-externals'
import * as buildArgs from './build.args'

const isDev = process.env.NODE_ENV === 'development'

const config: Configuration = {
  devtool: buildArgs.useSourceMaps ? 'source-map' : false,
  entry: {
    'index.workers': path.join(buildArgs.inputDir, 'index.workers.tsx'),
  },
  externals: [
    nodeExternals(),
  ],
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.[jt]sx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      }],
    }, {
      test: /\.css$/,
      use: [{
        loader: 'css-loader',
        options: {
          modules: {
            exportOnlyLocals: true,
          },
        },
      }],
    }, {
      test: /\.svg$/,
      include: /assets\/svgs/,
      type: 'asset/source',
    }, {
      test: /\.(jpe?g|png|gif|svg)(\?.*)?$/,
      exclude: /assets\/svgs/,
      type: 'asset',
      generator: {
        filename: `assets/images/${buildArgs.skipOptimizations ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      type: 'asset',
      generator: {
        filename: `assets/media/${buildArgs.skipOptimizations ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      type: 'asset',
      generator: {
        filename: `assets/fonts/${buildArgs.skipOptimizations ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  optimization: {
    nodeEnv: false,
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: buildArgs.outputDir,
    publicPath: buildArgs.publicPath,
    sourceMapFilename: '[file].map',
  },
  performance: {
    hints: isDev ? false : 'warning',
    maxAssetSize: 512 * 1024,
    maxEntrypointSize: 512 * 1024,
  },
  plugins: [
    new ForkTSCheckerPlugin(),
    new DefinePlugin({
      __BUILD_ARGS__: JSON.stringify(buildArgs),
    }),
    ...buildArgs.useSourceMaps ? [
      new BannerPlugin({
        banner: 'require(\'source-map-support\').install();',
        raw: true,
        entryOnly: false,
      }),
    ] : [],
    ...buildArgs.useBundleAnalyzer ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    ] : [],
    ...isDev ? [
      new WatchIgnorePlugin({
        paths: [
          /ui/,
        ],
      }),
    ] : [],
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  stats: {
    colors: true,
    errorDetails: true,
    modules: true,
    reasons: true,
  },
  target: 'node',
}

export default config
