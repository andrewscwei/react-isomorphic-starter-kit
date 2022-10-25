/**
 * @file Webpack config for compiling the app client.
 */

import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import CSSMinimizerPlugin from 'css-minimizer-webpack-plugin'
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import { Configuration, DefinePlugin, EnvironmentPlugin, HotModuleReplacementPlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { WebpackManifestPlugin as ManifestPlugin } from 'webpack-manifest-plugin'
import * as buildArgs from './build.args'

const isDev = buildArgs.env === 'development'

const config: Configuration = {
  devtool: buildArgs.useSourceMaps ? 'source-map' : false,
  entry: {
    polyfills: path.join(buildArgs.inputDir, 'ui', 'polyfills.ts'),
    main: [
      path.join(buildArgs.inputDir, 'ui', 'index.ts'),
      ...isDev ? ['webpack-hot-middleware/client?reload=true'] : [],
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
          plugins: isDev ? [require.resolve('react-refresh/babel')] : [],
        },
      }],
    }, ...[true, false].map(useCSSModules => ({
      test: /\.css$/,
      ...useCSSModules ? { include: /\.module\.css$/ } : { exclude: /\.module\.css$/ },
      use: [{
        loader: isDev ? 'style-loader' : MiniCSSExtractPlugin.loader,
      }, {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          modules: useCSSModules,
          sourceMap: buildArgs.useSourceMaps,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: buildArgs.useSourceMaps,
          postcssOptions: {
            plugins: [
              ['postcss-preset-env', {
                features: {
                  'nesting-rules': true,
                },
              }],
            ],
          },
        },
      }],
    })), {
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
    minimizer: [
      new CSSMinimizerPlugin(),
      new TerserPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        js: {
          chunks: 'all',
          enforce: true,
          name: 'common',
          test: /node_modules/,
        },
        css: {
          chunks: 'all',
          enforce: true,
          minChunks: 2,
          name: 'common',
          test: /\.css$/,
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
      filename: buildArgs.skipOptimizations ? '[name].css' : '[name].[chunkhash].css',
    }),
    new ForkTSCheckerPlugin(),
    new DefinePlugin({
      __BUILD_ARGS__: JSON.stringify(buildArgs),
    }),
    new EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new CopyPlugin({
      patterns: [{
        from: path.join(buildArgs.inputDir, 'ui', 'static'),
        to: buildArgs.outputDir,
      }],
    }),
    ...isDev ? [
      new HotModuleReplacementPlugin(),
      new ReactRefreshPlugin(),
    ] : [
      new ManifestPlugin({
        fileName: buildArgs.assetManifestFile,
      }),
    ],
    ...buildArgs.useBundleAnalyzer ? [new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    })] : [],
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
  target: 'web',
}

export default config
