import { Router } from 'express'
import { XMLBuilder } from 'fast-xml-parser'
import { getLocalizedURLs } from '../i18n'
import { joinURL } from '../utils'

type Params = {
  localeChangeStrategy: string
  routes: RouteConfig[]
  translations: Record<string, any>
}

const { basePath, baseURL, defaultLocale } = __BUILD_ARGS__

/**
 * Sitemap generator.
 */
export default function renderSitemap({ localeChangeStrategy, routes, translations }: Params) {
  const router = Router()

  router.use(joinURL(basePath, '/sitemap.xml'), async (req, res, next) => {
    res.header('Content-Type', 'application/xml')

    try {
      const supportedLocales = Object.keys(translations)
      const urls = routes.filter(config => config.path !== '*').reduce<string[]>((out, config) => [
        ...out,
        ...localeChangeStrategy === 'path' ? getLocalizedURLs(config.path, { defaultLocale, supportedLocales }) : [config.path],
      ], [])

      const builder = new XMLBuilder()
      const xml = builder.build({
        'urlset': {
          url: urls.map(t => ({
            'loc': joinURL(baseURL, t),
            'lastmod': new Date().toISOString(),
            'changefreq': 'daily',
            'priority': '0.7',
          })),
        },
      })

      res.send(xml)
    }
    catch (err) {
      next(err)
    }
  })

  return router
}
