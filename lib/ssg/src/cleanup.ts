import { readdir, unlink } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { debug } from '../../utils/debug.js'

type Options = {
  outDir: string
}

export async function cleanup({ outDir }: Options) {
  const files = await readdir(outDir, { recursive: true })
  const removeExtensions = ['.js', '.d.ts']

  Promise.all(files.map(async file => {
    if (!removeExtensions.find(t => extname(file) === t)) return

    const filePath = resolve(outDir, file)

    try {
      await unlink(filePath)
      debug(`Cleaning up file ${filePath}...`, 'OK')
    }
    catch (err) {
      console.error(`Error deleting file ${filePath}: ${err}`)
    }
  }))
}
