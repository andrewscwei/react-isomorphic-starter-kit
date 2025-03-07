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
   * The base URL of the public assets.
   */
  baseURL?: string

  /**
   * The canonical URL of the current page of the application.
   */
  canonicalURL?: string

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
   * Specifies if the page is not intended to be indexed, hence should including
   * necessary meta tags. Defaults to `false`.
   */
  noIndex?: boolean

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
   * The Apple meta tags.
   */
  apple?: {
    statusBarStyle?: 'default' | 'black' | 'black-translucent'
    title?: string
  }

  /**
   * The Open Graph meta tags.
   */
  openGraph?: {
    description?: string
    image?: string
    imageAlt?: string
    siteName?: string
    title?: string
    type?: string
    url?: string
  }

  /**
   * The Twitter meta tags.
   */
  twitter?: {
    card?: 'summary_large_image' | 'summary' | 'app' | 'player'
    description?: string
    image?: string
    title?: string
  }
}
