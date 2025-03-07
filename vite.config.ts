import react from '@vitejs/plugin-react'
import { minify } from 'html-minifier-terser'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import packageInfo from './package.json'

export default defineConfig(({ mode, isSsrBuild }) => {
  const isDev = mode === 'development'
  const isEdge = process.argv.indexOf('--ssr') !== -1 ? process.argv[process.argv.indexOf('--ssr') + 1]?.includes('edge') === true : false
  const env = loadEnv(mode, process.cwd(), '')
  const args = defineArgs(env)
  const rootDir = resolve(__dirname, 'src')
  const outDir = resolve(__dirname, 'build')
  const publicDir = resolve(__dirname, 'static')
  const skipOptimizations = isDev || env.npm_config_raw === 'true'

  return {
    root: rootDir,
    base: args.BASE_PATH,
    envDir: __dirname,
    publicDir: isSsrBuild ? false : publicDir,
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
    define: {
      ...Object.keys(args).reduce((acc, key) => ({
        ...acc,
        [`import.meta.env.${key}`]: JSON.stringify(args[key]),
      }), {}),
    },
    plugins: [
      react(),
      htmlMinifier({ outDir, skipOptimizations }),
    ],
    resolve: {
      alias: {
        '@lib': resolve(__dirname, 'lib'),
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

const defineArgs = (env: Record<string, string>) => ({
  BASE_PATH: env.BASE_PATH ?? '/',
  BASE_URL: env.BASE_URL ?? '',
  BUILD_TIME: env.BUILD_TIME ?? new Date().toISOString(),
  BUILD_NUMBER: env.BUILD_NUMBER ?? 'local',
  DEBUG: env.DEBUG ?? '',
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

const htmlMinifier = ({ outDir, skipOptimizations }): Plugin => ({
  name: 'html-minifier',
  closeBundle: async () => {
    if (skipOptimizations === true) return

    let files: string[]

    try {
      files = await readdir(outDir, { recursive: true })
    }
    catch {
      console.warn('Minifying HTML...', 'SKIP', `No directory found at '${outDir}'`)
      return
    }

    await Promise.all(files.map(async file => {
      if (extname(file) !== '.html') return

      const filePath = resolve(outDir, file)
      const input = await readFile(filePath, 'utf8')
      const output = await minify(input, {
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      })

      await writeFile(filePath, output, 'utf8')
    }))
  },
})
