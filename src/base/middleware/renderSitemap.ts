import { Router } from 'express'
import { XMLBuilder } from 'fast-xml-parser'
import { BASE_PATH, BASE_URL, DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY } from '../../app.conf'
import translations from '../../locales'
import routesConf from '../../routes.conf'
import { getLocalizedURLs } from '../providers/I18nProvider'
import joinURL from '../utils/joinURL'

/**
 * Sitemap generator.
 */
export default function renderSitemap() {
  const router = Router()
  const routes = routesConf

  router.use(joinURL(BASE_PATH, '/sitemap.xml'), async (req, res, next) => {
    res.header('Content-Type', 'application/xml')

    try {
      const supportedLocales = Object.keys(translations)
      const urls = routes.filter(config => config.path !== '*').reduce<string[]>((out, config) => [
        ...out,
        ...LOCALE_CHANGE_STRATEGY === 'path' ? getLocalizedURLs(config.path, { defaultLocale: DEFAULT_LOCALE, supportedLocales }) : [config.path],
      ], [])

      const builder = new XMLBuilder()
      const xml = builder.build({
        'urlset': {
          url: urls.map(t => ({
            'loc': joinURL(BASE_URL, t),
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
