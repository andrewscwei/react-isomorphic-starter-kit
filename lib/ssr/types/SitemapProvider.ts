/**
 * Function for generating a sitemap.
 *
 * @param request The request.
 *
 * @returns The sitemap.
 */
export type SitemapProvider = (request: Request) => Promise<string>
