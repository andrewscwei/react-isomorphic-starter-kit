/* eslint-disable @typescript-eslint/consistent-type-imports */
/**
 * @file Build arguments computed at buildtime and passed to both server and
 *       client runtime environments as global variable `__BUILD_ARGS__`.
 */

import dotenv from 'dotenv'
import path from 'path'
import packageInfo from '../package.json'

dotenv.config()

const packageVersion = packageInfo.version

/**
 * Specifies whether debug is enabled.
 */
export const debugEnabled = process.env.DEBUG_ENABLED === 'true' || process.env.NODE_ENV === 'development'

/**
 * Enabled debug channels in the client.
 */
export const debugChannels = process.env.DEBUG_CHANNELS?.split(',') ?? ['app']

/**
 * Build time (this should only be evaluated during build time).
 */
export const buildTime = new Date().toISOString()

/**
 * Build number.
 */
export const buildNumber = process.env.BUILD_NUMBER ?? 'local'

/**
 * Version number.
 */
export const version = `v${packageVersion}+build.${buildNumber}`

/**
 * Base URL of the app.
 */
export const baseURL = process.env.BASE_URL ?? ''

/**
 * Base path of the router (i.e. the `basename` property).
 */
export const basePath = process.env.BASE_PATH ?? '/'

/**
 * Absolute public URL for static assets.
 */
export const publicURL = process.env.PUBLIC_URL ?? baseURL

/**
 * Public path for static assets.
 */
export const publicPath = process.env.PUBLIC_PATH ?? basePath

/**
 * Default locale.
 */
export const defaultLocale = (process.env.DEFAULT_LOCALE ?? 'en') as import('../lib/i18n/types').Locale

/**
 * Lib directory.
 */
export const libDir = path.join(__dirname, '../', 'lib')

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
export const useSourceMaps = process.env.NODE_ENV === 'development'

/**
 * Specifies whether the bundle analyzer should be enabled while building.
 */
export const useBundleAnalyzer = process.env.npm_config_analyze === 'true'

/**
 * Specifies whether HTML/JS/CSS minifications should be disabled while
 * building.
 */
export const skipOptimizations = process.env.NODE_ENV === 'development' || process.env.npm_config_raw === 'true'

/**
 * Specifies whether the client should always try to hydrate.
 */
export const forceHydration = process.env.FORCE_HYDRATION === 'true' || process.env.npm_config_hydrate === 'true'

/**
 * File name of the generated asset manifest.
 */
export const assetManifestFile = 'asset-manifest.json'

/**
 * Port to serve the application in.
 */
export const port = Number(process.env.PORT ?? 8080)
