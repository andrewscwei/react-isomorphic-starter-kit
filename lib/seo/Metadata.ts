/**
 * Dictionary containing attribute values for various meta tags in the document
 * head.
 */
export type Metadata = {
  /**
   * The base title of the application. This is different from the `title`
   * property in that the latter represents the title of a specific page of the
   * application whereas `baseTitle` represents the title of the entire
   * application.
   */
  baseTitle?: string

  /**
   * The description of the current page of the application.
   */
  description?: string

  /**
   * The locale of the current page of the application.
   */
  locale?: string

  /**
   * The color of the mask icon (i.e. in <link rel='mask-icon'>).
   */
  maskIconColor?: string

  /**
   * The base URL of the public assets.
   */
  publicURL?: string

  /**
   * The theme color (i.e. in <meta name='theme-color'>).
   */
  themeColor?: string

  /**
   * The title of the current page of the application. Defaults to `baseTitle`
   * if unspecified.
   */
  title?: string

  /**
   * The URL of the current page of the application.
   */
  url?: string
}
