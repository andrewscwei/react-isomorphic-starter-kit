import { Router } from 'express'
import { XMLBuilder } from 'fast-xml-parser'
import { RouteObject } from 'react-router'
import { getLocalizedURLs } from '../i18n'
import { joinURL } from '../utils'

type Params = {
  localeChangeStrategy: string
  routes: RouteObject[]
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
      const urls = routes.filter(({ path }) => path !== '*').reduce<string[]>((out, { path }) => [
        ...out,
        ...path ? (localeChangeStrategy === 'path' ? getLocalizedURLs(path, { defaultLocale, supportedLocales }) : [path]) : [],
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
