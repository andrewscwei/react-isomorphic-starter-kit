/**
 * Minimal router abstraction consumed by the i18n module. Provide an
 * implementation to {@link I18nProvider} to decouple the module from any
 * specific routing library.
 */
export type RouterAdapter = {
  /**
   * Returns the current URL parts. Must trigger a re-render when the URL
   * changes for the provider to stay in sync.
   */
  useLocation: () => { hash: string; pathname: string; search: string }

  /**
   * Returns a function that navigates to the given path.
   */
  useNavigate: () => (to: string) => void
}
