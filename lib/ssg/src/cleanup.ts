import fs from 'node:fs'
import path from 'node:path'
import { debug } from '../../utils/debug.js'

type Options = {
  outDir: string
}

export async function cleanup({ outDir }: Options) {
  const files = fs.readdirSync(outDir)
  const removeExtensions = ['.js', '.d.ts']

  files.forEach(file => {
    if (removeExtensions.find(t => file.endsWith(t))) {
      const filePath = path.resolve(outDir, file)

      fs.unlink(filePath, err => {
        if (err) {
          console.error(`Error deleting file ${filePath}: ${err}`)
          return
        }

        debug(`Cleaning up file ${filePath}...`, 'OK')
      })
    }
  })
}
