/**
 * @file Build arguments computed at buildtime and passed to both server and
 *       client runtime environments as global variable `__BUILD_ARGS__`.
 */

import dotenv from 'dotenv'
import path from 'path'
import packageInfo from '../package.json'

dotenv.config()

export const packageVersion = packageInfo.version

/**
 * Indicates whether the current environment is development.
 */
export const isDev = process.env.NODE_ENV !== 'production'

/**
 * Version number.
 */
export const version = packageVersion

/**
 * Build number.
 */
export const buildNumber = process.env.BUILD_NUMBER || 'local'

/**
 * Input directory of source files to compile.
 */
export const inputDir = path.join(__dirname, '../', 'src')

/**
 * Output directory of the built files.
 */
export const outputDir = path.join(__dirname, '../', 'build')

/**
 * Specifies whether source maps should be generated.
 */
export const useSourceMaps = isDev

/**
 * Specifies whether the bundle analyzer should be enabled while building.
 */
export const useBundleAnalyzer = process.env.npm_config_analyze === 'true'

/**
 * Specifies whether HTML/JS/CSS minifications should be disabled while
 * building.
 */
export const skipOptimizations = isDev || process.env.npm_config_raw === 'true'

/**
 * Public path for static assets.
 */
export const publicPath = process.env.PUBLIC_PATH || '/'

/**
 * Base path of the router (i.e. the `basename` property).
 */
export const basePath = process.env.BASE_PATH || '/'

/**
 * File name of the generated asset manifest.
 */
export const assetManifestFile = 'asset-manifest.json'
