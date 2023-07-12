import { Router } from 'express'
import { XMLBuilder } from 'fast-xml-parser'
import appConf from '../../app.conf'
import { getLocalizedURLs } from '../providers/I18nProvider'
import getTranslations from '../utils/getTranslations'
import joinURL from '../utils/joinURL'

type Params = {
  routes: RouteConfig[]
}

/**
 * Sitemap generator.
 */
export default function sitemap({ routes }: Params) {
  const router = Router()
  const { defaultLocale, url: hostname } = appConf

  router.use(joinURL(appConf.basePath, '/sitemap.xml'), async (req, res, next) => {
    res.header('Content-Type', 'application/xml')

    try {
      const supportedLocales = Object.keys(getTranslations())
      const urls = routes.filter(config => config.path !== '*').reduce<string[]>((out, config) => [
        ...out,
        ...appConf.changeLocaleStrategy === 'path' ? getLocalizedURLs(config.path, { defaultLocale, supportedLocales }) : [config.path],
      ], [])

      const builder = new XMLBuilder()
      const xml = builder.build({
        'urlset': {
          url: urls.map(t => ({
            'loc': joinURL(hostname, t),
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
