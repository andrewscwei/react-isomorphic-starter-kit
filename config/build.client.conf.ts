/**
 * @file Webpack config for compiling the app client.
 */

import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { Configuration, DefinePlugin, EnvironmentPlugin, HotModuleReplacementPlugin, IgnorePlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { WebpackManifestPlugin as ManifestPlugin } from 'webpack-manifest-plugin'
import appConf from '../src/app.conf'
import buildConf from './build.conf'
import { getBundlesFromDir } from './utils'

const config: Configuration = {
  devtool: buildConf.isDev ? 'source-map' : false,
  entry: getBundlesFromDir(path.join(buildConf.inputDir, 'bundles')).reduce<Record<string, any>>((out, curr) => {
    const bundleName = curr.replace('.ts', '')
    const bundlePath = path.join(buildConf.inputDir, 'bundles', curr)

    return {
      ...out,
      [bundleName]: [buildConf.isDev && 'webpack-hot-middleware/client?reload=true', bundlePath].filter(Boolean),
    }
  }, {}),
  mode: buildConf.isDev ? 'development' : 'production',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.[jt]sx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          plugins: [
            buildConf.isDev && require.resolve('react-refresh/babel'),
          ].filter(Boolean),
        },
      }],
    }, {
      test: /\.css$/,
      use: [{
        loader: buildConf.isDev ? 'style-loader' : MiniCSSExtractPlugin.loader,
      }, {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          modules: true,
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
  optimization: {
    minimize: !buildConf.skipOptimizations,
    splitChunks: {
      cacheGroups: {
        common: {
          chunks: 'all',
          enforce: true,
          name: 'common',
          test: /node_modules/,
        },
      },
    },
  },
  output: {
    filename: buildConf.skipOptimizations ? '[name].js' : '[chunkhash].js',
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
    ...buildConf.useBundleAnalyzer ? [new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    })] : [],
    new EnvironmentPlugin({
      'NODE_ENV': 'production',
      'APP_ENV': 'client',
    }),
    new CopyPlugin({
      patterns: [{
        from: path.join(buildConf.inputDir, 'static'),
        to: buildConf.outputDir,
      }],
    }),
    new DefinePlugin({
      __CONFIG__: JSON.stringify(appConf),
    }),
    !buildConf.isDev && new IgnorePlugin({
      resourceRegExp: /^.*\/config\/.*$/,
    }),
    !buildConf.isDev && new ManifestPlugin({ fileName: 'asset-manifest.json' }),
    buildConf.isDev && new HotModuleReplacementPlugin(),
    buildConf.isDev && new ReactRefreshPlugin(),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  stats: {
    colors: true,
    errorDetails: true,
    modules: true,
    reasons: true,
  },
  target: 'web',
}

export default config
