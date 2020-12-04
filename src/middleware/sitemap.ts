import { RequestHandler } from 'express'
import sitemap from 'sitemap'
import routes from '../routes/client'

export function generateSitemap(): RequestHandler {
  return async (req, res, next) => {
    try {
      const sm = sitemap.createSitemap({
        hostname: __BUILD_CONFIG__.meta.url,
        cacheTime: 600000,
        urls: routes.reduce((out: Array<any>, curr: { [key: string]: any }) => {
          if (curr.path === '*') return out

          return [
            ...out,
            {
              url: curr.path,
            },
          ]
        }, []),
      })

      const xml = await sm.toXML()

      res.header('Content-Type', 'application/xml').status(200).send(xml)
    }
    catch (err) {
      next(err)
    }
  }
}
