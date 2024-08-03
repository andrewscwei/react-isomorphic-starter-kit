/**
 * Function for populating `window.__localData` on each request.
 *
 * @param request The request.
 *
 * @returns The local data (will be JSON stringified).
 */
export type LocalDataFunction = (request: Request) => Promise<any>
