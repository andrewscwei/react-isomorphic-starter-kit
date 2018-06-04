/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
 */

import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import { BannerPlugin, Configuration, EnvironmentPlugin, DefinePlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import nodeExternals from 'webpack-node-externals';
import appConfig from './app.conf';

const isProduction = process.env.NODE_ENV === `production`;
const cwd = path.join(__dirname, `../`);
const inputDir = path.join(cwd, `src`);
const outputDir = path.join(cwd, `build`);
const useSourceMap = !isProduction || (isProduction && appConfig.build.sourceMap);
const useBundleAnalyzer = isProduction && appConfig.build.analyzer;

let manifest;

if (isProduction) {
  try { manifest = require(`../build/public/asset-manifest.json`); }
  catch (err) { /* Do nothing */ }
}

const config: Configuration = {
  devtool: `source-map`,
  entry: {
    server: path.join(inputDir, `server.tsx`),
  },
  externals: [nodeExternals()],
  mode: isProduction ? `production` : `development`,
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.tsx?$/,
      use: `ts-loader`,
    }, {
      test: /\.(jpe?g|png|gif|svg|ico)(\?.*)?$/,
      use: `url-loader?limit=10000&emitFile=false&name=assets/images/[name]${isProduction ? `.[hash:6]` : ``}.[ext]`,
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: `url-loader?limit=10000&emitFile=false&name=assets/media/[name]${isProduction ? `.[hash:6]` : ``}.[ext]`,
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: `url-loader?limit=10000&emitFile=false&name=assets/fonts/[name]${isProduction ? `.[hash:6]` : ``}.[ext]`,
    }],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    path: outputDir,
    publicPath: isProduction ? appConfig.build.publicPath : `/`,
    filename: `[name].js`,
    sourceMapFilename: `[name].js.map`,
  },
  plugins: [
    new CopyPlugin([{
      from: path.join(cwd, `config`),
      ignore: [`.*`, `*.conf.js`, `*.conf.json`],
      to: path.join(outputDir, `config`),
    }]),
    new DefinePlugin({
      'process.env': {
        ASSET_MANIFEST: JSON.stringify(manifest),
      },
    }),
    new EnvironmentPlugin([`NODE_ENV`]),
    ...!useSourceMap ? [] : [
      new BannerPlugin({
        banner: `require('source-map-support').install();`,
        entryOnly: false,
        raw: true,
      }),
    ],
    ...!useBundleAnalyzer ? [] : [
      new BundleAnalyzerPlugin(),
    ],
  ],
  resolve: {
    alias: {
      '@': inputDir,
    },
    extensions: [`.js`, `.jsx`, `.ts`, `.tsx`, `.json`],
  },
  stats: {
    colors: true,
    errorDetails: true,
    modules: true,
    reasons: true,
  },
  target: `node`,
};

export default config;
