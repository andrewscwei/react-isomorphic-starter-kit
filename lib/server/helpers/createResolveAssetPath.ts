import { joinURL } from '../../utils'

type Options = {
  /**
   * Public path of assets.
   */
  publicPath?: string

  /**
   * Absolute path of the manifest file.
   */
  manifest?: Record<string, string>
}

type ResolveAssetPath = (path: string) => string

export default function createResolveAssetPath({ publicPath = '/', manifest }: Options = {}): ResolveAssetPath {
  return (path: string): string => {
    let out = path

    if (manifest !== undefined) {
      try {
        const normalizedPath: string = joinURL(...path.split('/').filter(Boolean))
        out = manifest[normalizedPath] ?? manifest[joinURL(publicPath, normalizedPath)] ?? normalizedPath
      }
      catch (err) {}
    }

    if (!out.startsWith(publicPath)) out = joinURL(publicPath, out)

    return out
  }
}
