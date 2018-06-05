/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
 */

import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import { Configuration, DefinePlugin, EnvironmentPlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import nodeExternals from 'webpack-node-externals';
import appConfig from './app.conf';

const isProduction = process.env.NODE_ENV === `production`;
const cwd = path.join(__dirname, `../`);
const inputDir = path.join(cwd, `src`);
const outputDir = path.join(cwd, `build`);
const useBundleAnalyzer = isProduction && appConfig.build.analyzer;

let manifest;

if (isProduction) {
  try { manifest = require(`../build/public/asset-manifest.json`); }
  catch (err) { /* Do nothing */ }
}

const config: Configuration = {
  devtool: isProduction ? (appConfig.build.sourceMap ? `source-map` : false) : `cheap-eval-source-map`,
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
    filename: `[name].js`,
    path: outputDir,
    publicPath: isProduction ? appConfig.build.publicPath : `/`,
    sourceMapFilename: `[name].js.map`,
  },
  plugins: [
    new CopyPlugin([{
      from: path.join(cwd, `config`),
      ignore: [`.*`, `*.conf.*`, `*.ts`],
      to: path.join(outputDir, `config`),
    }]),
    new DefinePlugin({
      $ASSET_MANIFEST: JSON.stringify(manifest),
    }),
    new EnvironmentPlugin([`NODE_ENV`]),
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
