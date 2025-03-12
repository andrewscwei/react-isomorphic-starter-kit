export type RequestHandler = (params: { request: Request; env: Record<string, any> }) => Promise<Response>
