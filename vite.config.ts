/* eslint-disable no-console */

import react from '@vitejs/plugin-react'
import { minify } from 'html-minifier-terser'
import { readdir, readFile, rename, writeFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'

import packageInfo from './package.json'

const loadArgs = (env: Record<string, string>) => ({
  BASE_PATH: join('/', (env.BASE_PATH ?? '/').replace(/\/+$/, '')),
  BASE_URL: (env.BASE_URL ?? '').replace(/\/+$/, ''),
  BUILD_NUMBER: env.BUILD_NUMBER ?? 'local',
  BUILD_TIME: env.BUILD_TIME ?? new Date().toISOString(),
  DEBUG: env.DEBUG === 'true',
  DEFAULT_LOCALE: env.DEFAULT_LOCALE ?? 'en',
  VERSION: packageInfo.version,
})

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const args = loadArgs(env)
  const isDev = mode === 'development'
  const isEdgeBuild = process.argv.indexOf('--ssr') !== -1 ? process.argv[process.argv.indexOf('--ssr') + 1]?.includes('edge') === true : false
  const skipOptimizations = isDev || env.npm_config_raw === 'true'
  const rootDir = resolve(__dirname, 'src')
  const libDir = resolve(__dirname, 'lib')
  const outDir = resolve(__dirname, 'build')
  const publicDir = resolve(__dirname, 'public')

  printArgs(args)

  return {
    base: args.BASE_PATH,
    build: {
      emptyOutDir: false,
      minify: skipOptimizations ? false : 'esbuild',
      outDir: isSsrBuild ? outDir : join(outDir, args.BASE_PATH),
      rollupOptions: {
        output: {
          // Enable clean up of SSR chunk files from prerendering.
          chunkFileNames: isSsrBuild ? '[hash].js' : 'assets/[hash].js',
        },
        treeshake: 'smallest',
      },
    },
    define: {
      ...Object.entries(args).reduce((acc, [key, value]) => ({
        ...acc,
        [`import.meta.env.${key}`]: JSON.stringify(value),
      }), {}),
    },
    envDir: __dirname,
    plugins: [
      react(),
      htmlMinifier({ outDir, isEnabled: !skipOptimizations }),
      fileFlattener(['index.html'], { basePath: args.BASE_PATH, outDir, isEnabled: !!isSsrBuild }),
    ],
    publicDir: isSsrBuild ? false : publicDir,
    resolve: {
      alias: {
        '@': rootDir,
        '@lib': libDir,
      },
    },
    root: rootDir,
    server: {
      host: '0.0.0.0',
      port: Number(env.PORT ?? 8080),
    },
    ssr: {
      target: isEdgeBuild ? 'webworker' : 'node',
    },
    test: {
      coverage: {
        provider: 'v8',
        reporter: ['text-summary'],
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

function printArgs(args: ReturnType<typeof loadArgs>) {
  const green = (text: string) => `\x1b[32m${text}\x1b[0m`
  const magenta = (text: string) => `\x1b[35m${text}\x1b[0m`

  console.log(green('Build args:'))

  Object.entries(args).forEach(([key, value]) => {
    console.log(`${magenta(key)}: ${JSON.stringify(value)}`)
  })
}

function htmlMinifier({ outDir, isEnabled }: { outDir: string; isEnabled: boolean }): Plugin {
  return {
    name: 'Custom plugin for minifying HTML files after bundle generation',
    writeBundle: async () => {
      if (!isEnabled) return

      const files = await readdir(outDir, { recursive: true })

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
  }
}

function fileFlattener(files: string[], { basePath, outDir, isEnabled }: { basePath: string; outDir: string; isEnabled: boolean }): Plugin {
  return {
    closeBundle: async () => {
      if (!isEnabled) return

      const targetDir = join(outDir, basePath)
      if (targetDir === outDir) return

      try {
        await Promise.all(files.map(async file => {
          await rename(join(targetDir, file), join(outDir, file))
        }))
      } catch (err) {
        console.warn('Flattening files...', 'SKIP', err)
      }
    },
    name: 'Custom plugin for flattening files from the base path to the output root at the end of the build',
  }
}
