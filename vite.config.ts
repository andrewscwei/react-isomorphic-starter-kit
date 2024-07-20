import PostCSSPurgeCSS from '@fullhuman/postcss-purgecss'
import react from '@vitejs/plugin-react'
import { minify } from 'html-minifier-terser'
import fs from 'node:fs'
import path from 'node:path'
import PostCSSImportPlugin from 'postcss-import'
import PostCSSPresetEnvPlugin from 'postcss-preset-env'
import { loadEnv, type Plugin } from 'vite'
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
  // Version number
  VERSION: packageInfo.version,
})

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const buildArgs = parseBuildArgs(env)
  const rootDir = path.resolve(__dirname, 'src')
  const isDev = env.NODE_ENV === 'development'
  const skipOptimizations = isDev || env.npm_config_raw === 'true'
  const useSourceMaps = isDev
  const port = Number(env.PORT ?? 8080)

  return {
    root: rootDir,
    base: buildArgs.BASE_PATH,
    publicDir: isSsrBuild ? false : path.resolve(rootDir, 'static'),
    build: {
      cssCodeSplit: false,
      cssMinify: skipOptimizations ? false : 'esbuild',
      emptyOutDir: false,
      minify: skipOptimizations ? false : 'esbuild',
      outDir: path.resolve(__dirname, 'build'),
      reportCompressedSize: true,
      sourcemap: useSourceMaps,
      target: 'esnext',
      rollupOptions: {
        output: {
          chunkFileNames: isSsrBuild ? '[hash].js' : 'assets/[hash].js',
        },
      },
    },
    ssr: {
      noExternal: [
        '@remix-run/router',
        'react-router-dom',
        'react-router',
      ],
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
                path.resolve(rootDir, '**/*.html'),
                path.resolve(rootDir, '**/*.tsx'),
                path.resolve(rootDir, '**/*.ts'),
                path.resolve(rootDir, '**/*.module.css'),
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
      ...isDev ? [] : [{
        name: 'html-minifier-terser',
        enforce: 'post',
        apply: 'build',
        closeBundle: async () => {
          const outDir = path.resolve(__dirname, 'build')
          const files = fs.readdirSync(outDir)

          for (const file of files) {
            if (file.endsWith('.html')) {
              const filePath = path.join(outDir, file)
              const html = fs.readFileSync(filePath, 'utf8')
              const minifiedHtml = await minify(html, {
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
              })

              fs.writeFileSync(filePath, minifiedHtml, 'utf8')
            }
          }
        },
      } as Plugin],
    ],
    resolve: {
      alias: {
        '@lib': path.resolve(__dirname, 'lib'),
      },
    },
    server: {
      host: 'localhost',
      port,
    },
    test: {
      coverage: {
        reporter: ['text-summary'],
        provider: 'v8',
      },
      globals: true,
      environment: 'jsdom',
    },
  }
})
