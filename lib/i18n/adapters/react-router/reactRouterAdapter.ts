import { useLocation, useNavigate } from 'react-router'

import { type RouterAdapter } from '../../types/RouterAdapter.js'

/**
 * A {@link RouterAdapter} bound to `react-router`.
 */
export const reactRouterAdapter: RouterAdapter = {
  useLocation,
  useNavigate,
}
