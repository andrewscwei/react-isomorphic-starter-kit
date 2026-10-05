import { type RouterAdapter } from '../../types/RouterAdapter.js'

/**
 * Creates a {@link RouterAdapter} for use in the browser without a client-side
 * router. Navigating performs a full page load, and the location is not
 * reactive, so it should only be paired with the `action` locale change
 * strategy.
 *
 * @returns A {@link RouterAdapter} instance.
 */
export function createBrowserRouterAdapter(): RouterAdapter {
  return {
    useLocation: () => ({ hash: window.location.hash, pathname: window.location.pathname, search: window.location.search }),
    useNavigate: () => to => { window.location.href = to },
  }
}
