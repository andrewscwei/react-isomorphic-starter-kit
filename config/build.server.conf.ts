/**
 * @file Webpack config for compiling the app server.
 */

import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { BannerPlugin, Configuration, DefinePlugin, EnvironmentPlugin, WatchIgnorePlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import nodeExternals from 'webpack-node-externals'
import * as buildArgs from './build.args'

const isDev = buildArgs.env === 'development'

const config: Configuration = {
  devtool: isDev ? 'source-map' : false,
  entry: {
    index: path.join(buildArgs.inputDir, 'index.ts'),
  },
  externals: [nodeExternals()],
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
          importLoaders: 1,
          modules: {
            exportOnlyLocals: true,
          },
          sourceMap: isDev,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: isDev,
          postcssOptions: {
            plugins: [
              ['postcss-preset-env', {
                features: {
                  'nesting-rules': true,
                },
              }],
              !buildArgs.skipOptimizations && 'cssnano',
            ].filter(Boolean),
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
    new MiniCSSExtractPlugin({
      chunkFilename: buildArgs.skipOptimizations ? '[id].css' : '[id].[chunkhash].css',
      filename: buildArgs.skipOptimizations ? '[name].css' : '[name].[chunkhash].css',
    }),
    new ForkTSCheckerPlugin(),
    new DefinePlugin({
      '__BUILD_ARGS__': JSON.stringify(buildArgs),
    }),
    new EnvironmentPlugin({
      'NODE_ENV': 'production',
      'APP_ENV': 'server',
    }),
    ...isDev ? [
      new BannerPlugin({
        banner: 'require(\'source-map-support\').install();',
        raw: true,
        entryOnly: false,
      }),
      new WatchIgnorePlugin({
        paths: [
          /ui/,
        ],
      }),
    ] : [],
    ...buildArgs.useBundleAnalyzer ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
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
