/// <reference path="../local-data.d.ts" />

/**
 * Retrieves the local data object from the server-rendered page.
 *
 * @returns The local data object.
 */
export function getLocalData(): Partial<LocalData> {
  return (window as any).__localData ?? {}
}
