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
import * as buildArgs from './build.args'

const isDev = buildArgs.env === 'development'

const config: Configuration = {
  devtool: isDev ? 'source-map' : false,
  entry: {
    polyfills: path.join(buildArgs.inputDir, 'ui', 'polyfills.ts'),
    main: [
      ...isDev ? ['webpack-hot-middleware/client?reload=true'] : [],
      path.join(buildArgs.inputDir, 'ui', 'index.tsx'),
    ],
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.[jt]sx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          plugins: [
            isDev && require.resolve('react-refresh/babel'),
          ].filter(Boolean),
        },
      }],
    }, {
      test: /\.css$/,
      use: [{
        loader: isDev ? 'style-loader' : MiniCSSExtractPlugin.loader,
      }, {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          modules: true,
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
  optimization: {
    minimize: !buildArgs.skipOptimizations,
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
    filename: buildArgs.skipOptimizations ? '[name].js' : '[name].[chunkhash].js',
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
    ...buildArgs.useBundleAnalyzer ? [new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    })] : [],
    new DefinePlugin({
      '__BUILD_ARGS__': JSON.stringify(buildArgs),
    }),
    new EnvironmentPlugin({
      'NODE_ENV': 'production',
      'APP_ENV': 'client',
    }),
    new CopyPlugin({
      patterns: [{
        from: path.join(buildArgs.inputDir, 'ui', 'static'),
        to: buildArgs.outputDir,
      }],
    }),
    !isDev && new IgnorePlugin({
      resourceRegExp: /^.*\/config\/.*$/,
    }),
    !isDev && new ManifestPlugin({ fileName: 'asset-manifest.json' }),
    isDev && new HotModuleReplacementPlugin(),
    isDev && new ReactRefreshPlugin(),
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
