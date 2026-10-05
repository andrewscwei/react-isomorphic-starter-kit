import { type RouterAdapter } from '../../types/RouterAdapter.js'

/**
 * Creates a {@link RouterAdapter} for server-rendering a single request.
 * Navigating is unsupported and throws.
 *
 * @param url The URL of the request being rendered.
 *
 * @returns A {@link RouterAdapter} instance.
 *
 * @throws Error when attempting to navigate using the returned router adapter.
 */
export function createEdgeRouterAdapter(url: URL): RouterAdapter {
  return {
    useLocation: () => ({ hash: url.hash, pathname: url.pathname, search: url.search }),
    useNavigate: () => () => { throw new Error('Navigation is not supported during edge rendering') },
  }
}
