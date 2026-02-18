export type RequestHandler = (params: { env: Record<string, any>; request: Request }) => Promise<Response>
