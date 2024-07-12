import PostCSSPurgeCSS from '@fullhuman/postcss-purgecss'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import PostCSSImportPlugin from 'postcss-import'
import PostCSSPresetEnvPlugin from 'postcss-preset-env'
import { loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vitest/config'
import packageInfo from './package.json'

const parseBuildArgs = (env: Record<string, string>) => ({
  // Base path of the router (i.e. the `basename` property)
  BASE_PATH: env.BASE_PATH ?? '/',
  // Base URL of the app
  BASE_URL: env.BASE_URL ?? '',
  // Build number
  BUILD_NUMBER: env.BUILD_NUMBER ?? 'local',
  // Public path for static assets
  PUBLIC_PATH: env.PUBLIC_PATH ?? env.BASE_PATH ?? '/',
  // Absolute public URL for static assets
  PUBLIC_URL: env.PUBLIC_URL ?? env.BASE_URL ?? '',
  // Version number
  VERSION: packageInfo.version,
})

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const buildArgs = parseBuildArgs(env)
  const rootDir = __dirname
  const isDev = env.NODE_ENV === 'development'
  const skipOptimizations = isDev || env.npm_config_raw === 'true'
  const useSourceMaps = isDev
  const port = Number(env.PORT ?? 8080)

  return {
    root: rootDir,
    base: buildArgs.PUBLIC_PATH,
    publicDir: isSsrBuild ? false : path.resolve(rootDir, 'src/static'),
    build: {
      cssMinify: skipOptimizations ? false : 'esbuild',
      emptyOutDir: false,
      minify: skipOptimizations ? false : 'esbuild',
      outDir: isSsrBuild ? path.resolve(rootDir, 'build') : path.resolve(rootDir, 'build'),
      reportCompressedSize: true,
      sourcemap: useSourceMaps,
      target: 'esnext',
      rollupOptions: isSsrBuild ? {
        input: path.resolve(rootDir, 'src/main.server.tsx'),
      } : {},
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: isDev ? '[name]_[local]_[hash:base64:5]' : '_[hash:base64:5]',
      },
      postcss: {
        plugins: [
          PostCSSImportPlugin(),
          PostCSSPresetEnvPlugin({
            features: {
              'nesting-rules': true,
            },
          }),
          ...isDev ? [] : [
            PostCSSPurgeCSS({
              content: [
                path.resolve(rootDir, 'src/**/*.html'),
                path.resolve(rootDir, 'src/**/*.tsx'),
                path.resolve(rootDir, 'src/**/*.ts'),
                path.resolve(rootDir, 'src/**/*.module.css'),
              ],
              safelist: [
                /^_[A-Za-z0-9-_]{5}$/,
              ],
              defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) ?? [],
            }),
          ],
        ],
      },
    },
    define: {
      ...Object.keys(buildArgs).reduce((acc, key) => ({
        ...acc,
        [`import.meta.env.${key}`]: JSON.stringify(buildArgs[key]),
      }), {}),
    },
    plugins: [
      react(),
      svgr(),
      ...isSsrBuild ? [] : [
        createHtmlPlugin({
          minify: !skipOptimizations,
          entry: path.resolve(rootDir, 'src/main.client.tsx'),
          template: 'src/index.html',
          inject: {
            data: {
              buildArgs,
              resolveURL: (subpath: string) => path.join(buildArgs.PUBLIC_URL, subpath),
            },
          },
        }),
      ],
    ],
    resolve: {
      alias: {
        '@lib': path.resolve(rootDir, 'lib'),
      },
    },
    server: {
      host: 'localhost',
      port,
    },
    test: {
      coverage: {
        reportsDirectory: path.resolve(rootDir, 'coverage'),
        provider: 'v8',
      },
      reporters: ['default'],
      globals: true,
      environment: 'jsdom',
    },
  }
})
