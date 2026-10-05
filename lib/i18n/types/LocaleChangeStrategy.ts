/**
 * Specifies how the locale is changed in an application and where it is
 * represented:
 *
 * - `action`: The locale is changed by dispatching an action and is not
 *             represented in the URL. Under this strategy, URL and route
 *             helpers are no-ops.
 * - `path`: The locale is the first segment of the URL path, e.g.
 *           `example.com/ja/`.
 * - `query`: The locale is the `locale` query parameter of the URL, e.g.
 *            `example.com/?locale=ja`.
 */
export type LocaleChangeStrategy = 'action' | 'path' | 'query'
