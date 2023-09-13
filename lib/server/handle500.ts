import { type ErrorRequestHandler } from 'express'

/**
 * Middleware for the final point of error handling. Any error that was
 * previously thrown will skip all intermediate middleware and go straight to
 * here, where the server will first render an error view if the request accepts
 * html, or respond with the error info in a JSON payload. If the error that
 * ends up here does not have a status code, it will default to 500.
 *
 * @returns The request handler.
 */
export function handle500(): ErrorRequestHandler {
  return (err, req, res) => {
    res.status(err.status || 500).send(err)
  }
}
