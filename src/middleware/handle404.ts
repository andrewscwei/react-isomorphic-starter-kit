/**
 * @file Middleware to handle 404 error, when the requested URI is not found.
 */

import { RequestHandler } from 'express'

export default function handle404(): RequestHandler {
  return (req, res, next) => {
    const err = Error(`${req.method} ${req.path} is not handled.`)
    err.status = 404
    next(err)
  }
}
