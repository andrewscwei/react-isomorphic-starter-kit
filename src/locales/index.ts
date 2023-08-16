import { loadTranslations } from '../../lib/i18n'
import { tryOrUndefined } from '../../lib/utils'

export const translations = tryOrUndefined(() => loadTranslations(require.context('./', true, /^.*\.json$/))) ?? {}
