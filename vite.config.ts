/* eslint-disable no-console */

import react from '@vitejs/plugin-react'
import { minify } from 'html-minifier-terser'
import { readdir, readFile, rename, writeFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import packageInfo from './package.json'

const defineArgs = (env: ReturnType<typeof loadEnv>) => ({
  BASE_PATH: join('/', (env.BASE_PATH ?? '/').replace(/\/+$/, '')),
  BASE_URL: (env.BASE_URL ?? '').replace(/\/+$/, ''),
  BUILD_TIME: env.BUILD_TIME ?? new Date().toISOString(),
  BUILD_NUMBER: env.BUILD_NUMBER ?? 'local',
  DEBUG: env.DEBUG ?? '',
  DEFAULT_LOCALE: env.DEFAULT_LOCALE ?? 'en',
  VERSION: packageInfo.version,
})

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const args = defineArgs(env)
  const isDev = mode === 'development'
  const isEdgeBuild = process.argv.indexOf('--ssr') !== -1 ? process.argv[process.argv.indexOf('--ssr') + 1]?.includes('edge') === true : false
  const rootDir = resolve(__dirname, 'src')
  const outDir = resolve(__dirname, 'build')
  const publicDir = resolve(__dirname, 'static')
  const skipOptimizations = isDev || env.npm_config_raw === 'true'

  printArgs(args)

  return {
    root: rootDir,
    base: args.BASE_PATH,
    envDir: __dirname,
    publicDir: isSsrBuild ? false : publicDir,
    build: {
      // Prevent FOUC in SSR builds.
      cssCodeSplit: false,
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
    ssr: {
      target: isEdgeBuild ? 'webworker' : 'node',
    },
    define: {
      ...Object.entries(args).reduce((acc, [key, value]) => ({
        ...acc,
        [`import.meta.env.${key}`]: JSON.stringify(value),
      }), {}),
    },
    plugins: [
      react(),
      terser({ isEnabled: !skipOptimizations, outDir }),
      hoist(['index.html', '_routes.json'], { basePath: args.BASE_PATH, isEnabled: !!isSsrBuild, outDir }),
    ],
    resolve: {
      alias: {
        '@lib': resolve(__dirname, 'lib'),
      },
    },
    server: {
      host: '0.0.0.0',
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

function printArgs(args: ReturnType<typeof defineArgs>) {
  const green = (text: string) => `\x1b[32m${text}\x1b[0m`
  const magenta = (text: string) => `\x1b[35m${text}\x1b[0m`

  console.log(green('Build args:'))
  Object.entries(args).forEach(([key, value]) => {
    console.log(`${magenta(key)}: ${JSON.stringify(value)}`)
  })
}

function terser({ isEnabled, outDir }: { isEnabled: boolean; outDir: string }): Plugin {
  return {
    name: 'terser',
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

function hoist(files: string[], { basePath, isEnabled, outDir }: { basePath: string; isEnabled: boolean; outDir: string }): Plugin {
  return {
    name: 'hoist',
    closeBundle: async () => {
      if (!isEnabled) return

      const targetDir = join(outDir, basePath)

      if (targetDir === outDir) return

      try {
        await Promise.all(files.map(async file => {
          await rename(join(targetDir, file), join(outDir, file))
        }))
      }
      catch (err) {
        console.warn('Flattening SSR files...', 'SKIP', err)

        return
      }
    },
  }
}
