import fs from 'fs'
import path from 'path'

type Options = {
  /**
   * Public path of assets.
   */
  publicPath?: string

  /**
   * Absolute path of the manifest file.
   */
  manifestFile?: string
}

type ResolveAssetPath = (path: string) => string

export default function createResolveAssetPath({ publicPath = '/', manifestFile }: Options = {}): ResolveAssetPath {
  return (pathToResolve: string): string => {
    let out = pathToResolve

    if (manifestFile !== undefined) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'))
        const normalizedPath: string = path.join(...pathToResolve.split('/'))

        out = manifest[normalizedPath] ?? manifest[path.join(publicPath, normalizedPath)] ?? normalizedPath
      }
      catch (err) {}
    }

    if (!out.startsWith(publicPath)) out = path.join(publicPath, out)

    return out
  }
}
