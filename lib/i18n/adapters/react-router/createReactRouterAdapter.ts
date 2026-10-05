import { useLocation, useNavigate } from 'react-router'

import { type RouterAdapter } from '../../types/RouterAdapter.js'

/**
 * Creates a {@link RouterAdapter} bound to `react-router`.
 *
 * @returns A {@link RouterAdapter} instance.
 */
export function createReactRouterAdapter(): RouterAdapter {
  return {
    useLocation,
    useNavigate,
  }
}
