import { joinURL } from '../../utils/joinURL'
import { type ResolveAssetPath } from '../types'

type Options = {
  /**
   * Public path of assets.
   */
  publicPath?: string

  /**
   * Absolute path of the asset manifest file.
   */
  manifest?: Record<string, string>
}

/**
 * Creates a function for resolving asset paths in the application against a
 * pregenerated manifest file.
 *
 * @param options See {@link Options}.
 *
 * @returns The resolved asset path.
 */
export function createResolveAssetPath({ publicPath = '/', manifest }: Options = {}): ResolveAssetPath {
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
