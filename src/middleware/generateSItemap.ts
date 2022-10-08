import { RequestHandler } from 'express'
import { SitemapStream, streamToPromise } from 'sitemap'
import { createGzip } from 'zlib'
import appConf from '../app.conf'
import translations from '../locales'
import routesConf from '../routes.conf'

let sitemap: any | undefined

export default function generateSitemap(): RequestHandler {
  const { defaultLocale, url: hostname } = appConf
  const supportedLocales = Object.keys(translations)

  return async (req, res, next) => {
    res.header('Content-Type', 'application/xml')
    res.header('COntent-Encoding', 'gzip')

    if (sitemap) return res.status(200).send(sitemap)

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

      streamToPromise(pipeline).then((sm: any) => sitemap = sm)
      smStream.end()
      pipeline.pipe(res).on('error', (err: unknown) => { throw err })
    }
    catch (err) {
      next(err)
    }
  }
}
