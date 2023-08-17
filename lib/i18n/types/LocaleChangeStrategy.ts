/**
 * Specifies how locale will be changed:
 * 1. `action`: Locale is changed by dispatching an action.
 * 2. `path`: Locale is changed by altering the path of the URL.
 * 3. `query`: Locale is changed by altering the query parameters of the URL.
 */
type LocaleChangeStrategy = 'action' | 'path' | 'query'

export default LocaleChangeStrategy
