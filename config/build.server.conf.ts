/**
 * @file Webpack config for compiling the app server.
 */

import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { BannerPlugin, Configuration, EnvironmentPlugin, WatchIgnorePlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import nodeExternals from 'webpack-node-externals'
import buildConf from './build.conf'

const config: Configuration = {
  devtool: buildConf.isDev ? 'source-map' : false,
  entry: {
    index: path.join(buildConf.inputDir, 'index.ts'),
  },
  externals: [nodeExternals()],
  mode: buildConf.isDev ? 'development' : 'production',
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
          sourceMap: buildConf.isDev,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: buildConf.isDev,
          postcssOptions: {
            plugins: [
              ['postcss-preset-env', {
                features: {
                  'nesting-rules': true,
                },
              }],
              !buildConf.skipOptimizations && 'cssnano',
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
        filename: `assets/images/${buildConf.skipOptimizations ? '[name]' : '[hash:base64]'}.[ext]`,
      },
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      type: 'asset',
      generator: {
        filename: `assets/media/${buildConf.skipOptimizations ? '[name]' : '[hash:base64]'}.[ext]`,
      },
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      type: 'asset',
      generator: {
        filename: `assets/fonts/${buildConf.skipOptimizations ? '[name]' : '[hash:base64]'}.[ext]`,
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
    path: buildConf.outputDir,
    publicPath: process.env.PUBLIC_PATH ?? '/static/',
    sourceMapFilename: '[file].map',
  },
  performance: {
    hints: buildConf.isDev ? false : 'warning',
    maxAssetSize: 512 * 1024,
    maxEntrypointSize: 512 * 1024,
  },
  plugins: [
    new MiniCSSExtractPlugin({
      chunkFilename: buildConf.skipOptimizations ? '[id].css' : '[chunkhash].css',
      filename: buildConf.skipOptimizations ? '[name].css' : '[chunkhash].css',
    }),
    new ForkTSCheckerPlugin(),
    new EnvironmentPlugin({
      'NODE_ENV': 'production',
      'APP_ENV': 'server',
    }),
    ...!buildConf.isDev ? [] : [
      new BannerPlugin({
        banner: 'require(\'source-map-support\').install();',
        raw: true,
        entryOnly: false,
      }),
      new WatchIgnorePlugin({
        paths: [
          /bundles/,
          /pages/,
          /components/,
        ],
      }),
    ],
    ...!buildConf.useBundleAnalyzer ? [] : [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    ],
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
