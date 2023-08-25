import { SitemapConfig } from '../lib/server'

const sitemap: SitemapConfig = {
  filter: (url: string) => {
    if (url.endsWith('*')) return false

    return true
  },
}

export default sitemap
