export type Middleware = {
  path: string
  handler: (request: Request) => Promise<Response>
}
