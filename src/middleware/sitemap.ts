import { Router } from 'express'
import { SitemapStream, streamToPromise } from 'sitemap'
import { createGzip } from 'zlib'
import appConf from '../app.conf'
import routesConf from '../routes.conf'
import translations from '../ui/locales'

/**
 * Sitemap generator.
 */
export default function sitemap() {
  const router = Router()
  const { defaultLocale, url: hostname } = appConf
  const supportedLocales = Object.keys(translations)

  let cached: any | undefined

  router.use('/sitemap.xml', async (req, res, next) => {
    res.header('Content-Type', 'application/xml')
    res.header('Content-Encoding', 'gzip')

    if (cached) return res.send(cached)

    try {
      const smStream = new SitemapStream({ hostname })
      const pipeline = smStream.pipe(createGzip())

      routesConf.forEach(config => {
        const path = config.path.startsWith('/') ? config.path.substring(1) : config.path
        if (path === '*') return

        supportedLocales.forEach(locale => {
          const url = locale === defaultLocale ? `/${path}` : `/${locale}/${path}`
          smStream.write({ url })
        })
      })

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
