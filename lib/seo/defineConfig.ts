import { type SEOConfig } from './types/index.js'

type Params = Partial<SEOConfig> & {
  /**
   * Filter for each URL.
   *
   * @param url URL iteratee.
   *
   * @returns `true` to include the URL, `false` to exclude.
   */
  urlsFilter?: (url: string) => boolean
}

export function defineConfig({
  baseURL = '',
  modifiedAt = new Date().toISOString(),
  urlsFilter = url => !url.endsWith('*'),
  urlsProvider,
}: Params): SEOConfig {
  return {
    baseURL: baseURL.replace(/\/+$/, ''),
    modifiedAt,
    urlsProvider: urlsProvider ?? (async routes => routes.filter(urlsFilter)),
  }
}
