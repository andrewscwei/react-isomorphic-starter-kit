import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import { minify } from 'html-minifier-terser'
import fs from 'node:fs'
import path from 'node:path'
import { loadEnv, type Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import packageInfo from './package.json'

const parseBuildArgs = (env: Record<string, string>) => ({
  BASE_PATH: env.BASE_PATH ?? '/',
  BASE_URL: env.BASE_URL ?? '',
  BUILD_TIME: env.BUILD_TIME ?? new Date().toISOString(),
  BUILD_NUMBER: env.BUILD_NUMBER ?? 'local',
  DEBUG_MODE: env.DEBUG_MODE ?? '',
  DEFAULT_LOCALE: env.DEFAULT_LOCALE ?? 'en',
  DEFAULT_METADATA: {
    baseTitle: 'React Isomorphic Starter Kit',
    baseURL: env.BASE_URL ?? '',
    description: 'React isomorphic app starter kit',
    maskIconColor: '#000',
    themeColor: '#15141a',
    title: 'React Isomorphic Starter Kit',
    url: env.BASE_URL ?? '',
  },
  VERSION: packageInfo.version,
})

export default defineConfig(({ mode, isSsrBuild }) => {
  const isDev = mode === 'development'
  const isEdge = process.argv.indexOf('--ssr') !== -1 ? process.argv[process.argv.indexOf('--ssr') + 1]?.includes('edge') === true : false

  const env = loadEnv(mode, process.cwd(), '')
  const buildArgs = parseBuildArgs(env)
  const rootDir = path.resolve(__dirname, 'src')
  const outDir = path.resolve(__dirname, 'build')
  const skipOptimizations = isDev || env.npm_config_raw === 'true'

  return {
    root: rootDir,
    base: buildArgs.BASE_PATH,
    envDir: __dirname,
    publicDir: isSsrBuild ? false : path.resolve(rootDir, 'static'),
    build: {
      cssCodeSplit: false,
      cssMinify: skipOptimizations ? false : 'esbuild',
      emptyOutDir: false,
      minify: skipOptimizations ? false : 'esbuild',
      outDir,
      reportCompressedSize: true,
      sourcemap: isDev ? 'inline' : isEdge,
      target: 'esnext',
      rollupOptions: {
        output: {
          chunkFileNames: isSsrBuild ? '[hash].js' : 'assets/[hash].js',
        },
      },
    },
    ssr: {
      target: isEdge ? 'webworker' : 'node',
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: isDev ? '[name]_[local]_[hash:base64:5]' : '_[hash:base64:5]',
      },
      postcss: {
        plugins: [
          autoprefixer(),
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
      ...isDev ? [] : [{
        name: 'html-minifier-terser',
        enforce: 'post',
        apply: 'build',
        closeBundle: async () => {
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
      port: Number(env.PORT ?? 8080),
    },
    test: {
      coverage: {
        reporter: ['text-summary'],
        provider: 'v8',
      },
      environment: 'happy-dom',
      globals: true,
      include: [
        '**/*.spec.ts',
        '**/*.spec.tsx',
      ],
      setupFiles: 'dotenv/config',
    },
  }
})
