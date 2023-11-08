/**
 * @file Webpack config for compiling the client.
 */

import PostCSSPurgeCSS from '@fullhuman/postcss-purgecss'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import CSSMinimizerPlugin from 'css-minimizer-webpack-plugin'
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import { DefinePlugin, EnvironmentPlugin, HotModuleReplacementPlugin, type Configuration } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { WebpackManifestPlugin as ManifestPlugin } from 'webpack-manifest-plugin'
import * as buildArgs from './build.args'

const isDev = process.env.NODE_ENV === 'development'

const config: Configuration = {
  devtool: buildArgs.useSourceMaps ? 'eval-source-map' : false,
  entry: {
    main: [
      path.join(buildArgs.inputDir, 'index.client.tsx'),
      ...isDev ? ['webpack-hot-middleware/client?reload=true'] : [],
    ],
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.[jt]sx?$/,
      use: [{
        loader: 'esbuild-loader',
        options: {
          target: 'es2015',
        },
      }],
    }, ...[true/* CSS modules */, false/* Non-CSS modules */].map(isModules => ({
      exclude: /node_modules/,
      test: /\.css$/,
      ...isModules ? { include: /\.module\.css$/ } : { exclude: /\.module\.css$/ },
      use: [{
        loader: isDev ? 'style-loader' : MiniCSSExtractPlugin.loader,
      }, {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          modules: isModules ? isDev ? { localIdentName: '[name]-[local]-[hash:base64:5]' } : true : false,
          sourceMap: buildArgs.useSourceMaps,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: buildArgs.useSourceMaps,
          postcssOptions: {
            plugins: [
              'postcss-import',
              ['postcss-preset-env', {
                features: {
                  'nesting-rules': true,
                },
              }],
              ...isDev ? [] : [PostCSSPurgeCSS({
                content: [
                  path.join(buildArgs.libDir, '**/*.tsx'),
                  path.join(buildArgs.inputDir, '**/*.html'),
                  path.join(buildArgs.inputDir, '**/*.tsx'),
                  path.join(buildArgs.inputDir, '**/*.ts'),
                  path.join(buildArgs.inputDir, '**/*.module.css'),
                ],
                defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
              })],
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
      new TerserPlugin({
        extractComments: false,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          chunks: 'all',
          enforce: true,
          name: 'styles',
          type: 'css/mini-extract',
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
      ignoreOrder: true,
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
        from: path.join(buildArgs.inputDir, 'static'),
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
    alias: {
      '@lib': buildArgs.libDir,
    },
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
