import type { ResolveAssetPath } from '../../templates'

type Options = {
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
export function createResolveAssetPath({ manifest }: Options = {}): ResolveAssetPath {
  return (path: string): string => manifest?.[path] ?? path
}
