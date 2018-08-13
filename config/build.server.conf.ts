/**
 * @file Webpack config for compiling the app server.
 */

import path from 'path';
import { Configuration, DefinePlugin, EnvironmentPlugin, Plugin, WatchIgnorePlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import nodeExternals from 'webpack-node-externals';
import appConfig from './app.conf';
import { getLocaleDataFromDir, getTranslationDataDictFromDir } from './utils';

const isProduction = process.env.NODE_ENV === `production`;
const cwd = path.join(__dirname, `../`);
const inputDir = path.join(cwd, `src`);
const outputDir = path.join(cwd, `build`);
const useBundleAnalyzer = isProduction && appConfig.build.analyzer;

const config: Configuration = {
  devtool: isProduction ? (appConfig.build.sourceMap ? `source-map` : false) : `source-map`,
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
  performance: {
    hints: isProduction ? `warning` : false,
  },
  plugins: [
    new DefinePlugin({
      __APP_ENV__: JSON.stringify(`server`),
      __ASSET_MANIFEST__: JSON.stringify((() => {
        let t;

        if (process.env.NODE_ENV === `production`) {
          try { t = require(path.join(__dirname, `../build/public/asset-manifest.json`)); }
          catch (err) { /* Do nothing */ }
        }

        return t;
      })()),
      __INTL_CONFIG__: JSON.stringify({
        defaultLocale: appConfig.locales[0],
        localeData: getLocaleDataFromDir(path.join(cwd, `config/locales`)),
        locales: appConfig.locales,
        dict: getTranslationDataDictFromDir(path.join(cwd, `config/locales`)),
      }),
    }),
    new EnvironmentPlugin([`NODE_ENV`]),
    ...!useBundleAnalyzer ? [] : [
      new BundleAnalyzerPlugin(),
    ],
    ...isProduction ? [] : [
      new WatchIgnorePlugin([
        /containers/,
        /components/,
      ]),
    ],
  ] as Array<Plugin>,
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
