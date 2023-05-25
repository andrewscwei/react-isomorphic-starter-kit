import { Router } from 'express'
import { XMLBuilder } from 'fast-xml-parser'
import appConf from '../app.conf'
import routesConf from '../routes.conf'
import translations from '../ui/locales'
import { getLocalizedURLs } from '../ui/providers/I18nProvider'

function urlJoin(...args: string[]): string {
  return args
    .join('/')
    .replace(/[/]+/g, '/')
    .replace(/^(.+):\//, '$1://')
    .replace(/^file:/, 'file:/')
    .replace(/\/(\?|&|#[^!])/g, '$1')
    .replace(/\?/g, '&')
    .replace('&', '?')
}

/**
 * Sitemap generator.
 */
export default function sitemap() {
  const router = Router()
  const { defaultLocale, url: hostname } = appConf

  let cached: any | undefined

  router.use(urlJoin(appConf.routerBasename, '/sitemap.xml'), async (req, res, next) => {
    res.header('Content-Type', 'application/xml')

    if (cached) return res.send(cached)

    try {
      const supportedLocales = Object.keys(translations)
      const urls = routesConf.filter(config => config.path !== '*').reduce<string[]>((out, config) => [
        ...out,
        ...appConf.changeLocaleStrategy === 'path' ? getLocalizedURLs(config.path, { defaultLocale, supportedLocales }) : [config.path],
      ], [])

      const builder = new XMLBuilder()
      const xml = builder.build({
        'urlset': {
          url: urls.map(t => ({
            'loc': urlJoin(hostname, t),
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
