/**
 * Provides the local data per request to be made available in the client-side
 * JavaScript as `window.__localData`.
 *
 * @param request The request.
 *
 * @returns The sitemap.
 */
export type LocalDataProvider = (request: Request) => Promise<any>
