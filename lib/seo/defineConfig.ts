import { type SEOConfig } from './types/index.js'
import { extractURLs } from './utils/index.js'

type Params = {
  /**
   * @see {@link SEOConfig.robotsProvider}
   */
  robotsProvider?: SEOConfig['robotsProvider']

  /**
   * @see {@link SEOConfig.urlsProvider}
   */
  urlsProvider?: SEOConfig['urlsProvider']

  /**
   * Filter for each URL.
   *
   * @param url URL iteratee.
   *
   * @returns `true` to include the URL, `false` to exclude.
   */
  urlFilter?: (url: string) => boolean
}

export function defineConfig({ robotsProvider, urlsProvider, urlFilter }: Params): SEOConfig {
  const filter = urlFilter ?? (url => !url.endsWith('*'))

  return {
    robotsProvider: robotsProvider ?? (async () => 'User-agent: * Disallow:'),
    urlsProvider: urlsProvider ?? (async routes => extractURLs(routes).filter(filter)),
  }
}
