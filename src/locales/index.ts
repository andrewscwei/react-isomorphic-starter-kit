import { loadTranslations } from '../../lib/i18n'
import { tryOrUndefined } from '../../lib/utils'

export default tryOrUndefined(() => loadTranslations(require.context('./', true, /^.*\.json$/))) ?? {}
