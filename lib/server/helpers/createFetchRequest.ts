import type { Request as ExpressRequest } from 'express'

export function createFetchRequest(req: ExpressRequest) {
  const origin = `${req.protocol}://${req.get('host')}`
  const url = new URL(req.originalUrl || req.url, origin)

  const controller = new AbortController()
  req.on('close', () => controller.abort())

  const headers = new Headers()

  for (const [key, values] of Object.entries(req.headers)) {
    if (!values) continue

    if (Array.isArray(values)) {
      for (const value of values) {
        headers.append(key, value)
      }
    }
    else {
      headers.set(key, values)
    }
  }

  const init: Record<string, any> = {
    method: req.method,
    headers,
    signal: controller.signal,
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body
  }

  return new Request(url.href, init)
}
