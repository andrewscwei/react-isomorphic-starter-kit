/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
 */

import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import { Configuration, DefinePlugin, EnvironmentPlugin, HotModuleReplacementPlugin, IgnorePlugin, NoEmitOnErrorsPlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ManifestPlugin from 'webpack-manifest-plugin';
import appConfig from './app.conf';

const isDev = process.env.NODE_ENV === `development`;
const cwd = path.join(__dirname, `../`);
const inputDir = path.join(cwd, `src`);
const outputDir = path.join(cwd, `build/public`);
const useBundleAnalyzer = !isDev && appConfig.build.analyzer;

let manifest;

try {
  manifest = require(`../build/public/asset-manifest.json`);
}
catch (err) { /* Do nothing */ }

const config: Configuration = {
  devtool: isDev ? `cheap-eval-source-map` : (appConfig.build.sourceMap ? `source-map` : false),
  mode: isDev ? `development` : `production`,
  target: `web`,
  stats: {
    colors: true,
    errorDetails: true,
    modules: true,
    reasons: true,
  },
  entry: {
    bundle: (isDev ? [`webpack-hot-middleware/client?reload=true`] : []).concat([path.join(inputDir, `client.tsx`)]),
  },
  output: {
    path: outputDir,
    publicPath: isDev ? `/` : appConfig.build.publicPath,
    filename: isDev ? `[name].js` : `[name].[chunkhash].js`,
    sourceMapFilename: `[file].map`,
  },
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.tsx?$/,
      use: `ts-loader`,
    }, {
      test: /\.(jpe?g|png|gif|svg|ico)(\?.*)?$/,
      use: `url-loader?limit=10000&name=assets/images/[name]${isDev ? `` : `.[hash:6]`}.[ext]`,
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: `url-loader?limit=10000&name=assets/media/[name]${isDev ? `` : `.[hash:6]`}.[ext]`,
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: `url-loader?limit=10000&name=assets/fonts/[name]${isDev ? `` : `.[hash:6]`}.[ext]`,
    }],
  },
  resolve: {
    alias: {
      '@': inputDir,
    },
    extensions: [`.ts`, `.tsx`, `.json`],
  },
  plugins: [
    // Directly copy static files to output directory.
    new CopyPlugin([{
      from: path.join(inputDir, `static`),
      ignore: [`.*`],
      to: outputDir,
    }]),
    new DefinePlugin({
      $APP_CONFIG: JSON.stringify(appConfig),
      $ASSET_MANIFEST: JSON.stringify(manifest),
    }),
    // Set runtime environment variables.
    new EnvironmentPlugin([`NODE_ENV`]),
    ...isDev ? [
      new HotModuleReplacementPlugin(),
      new NoEmitOnErrorsPlugin(),
    ] : [
      new IgnorePlugin(/^.*\/config\/.*$/),
      new ManifestPlugin({
        fileName: `asset-manifest.json`,
      }),
    ],
    ...useBundleAnalyzer ? [
      new BundleAnalyzerPlugin(),
    ] : [],
  ],
};

export default config;
