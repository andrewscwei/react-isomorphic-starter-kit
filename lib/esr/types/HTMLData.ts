/**
 * Type definition for data injected into HTML during server-side rendering.
 */
export type HTMLData = {
  [key: string]: any

  /**
   * Indicates if the application is in development mode.
   */
  dev: boolean

  /**
   * Local data to be injected into the HTML, typically as a script tag.
   */
  localData: string
}
