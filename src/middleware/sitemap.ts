import { Router } from 'express'
import { SitemapStream, streamToPromise } from 'sitemap'
import { createGzip } from 'zlib'
import appConf from '../app.conf'
import routesConf from '../routes.conf'
import translations from '../ui/locales'
import { getLocalizedURLs } from '../ui/providers/I18nProvider'

/**
 * Sitemap generator.
 */
export default function sitemap() {
  const router = Router()
  const { defaultLocale, url: hostname } = appConf

  let cached: any | undefined

  router.use('/sitemap.xml', async (req, res, next) => {
    res.header('Content-Type', 'application/xml')
    res.header('Content-Encoding', 'gzip')

    if (cached) return res.send(cached)

    try {
      const smStream = new SitemapStream({ hostname })
      const pipeline = smStream.pipe(createGzip())
      const supportedLocales = Object.keys(translations)
      const urls = routesConf.filter(config => config.path !== '*').reduce<string[]>((out, config) => [
        ...out,
        ...appConf.changeLocaleStrategy === 'path' ? getLocalizedURLs(config.path, { defaultLocale, supportedLocales }) : [config.path],
      ], [])

      urls.forEach(url => smStream.write({ url }))

      streamToPromise(pipeline).then(sm => cached = sm)
      smStream.end()
      pipeline.pipe(res).on('error', err => { throw err })
    }
    catch (err) {
      next(err)
    }
  })

  return router
}
