import { useI18n } from '@lib/i18n'

import { Page } from '@/ui/containers/Page.js'

export function Component() {
  const { t } = useI18n()

  return (
    <Page
      metadata={{
        noIndex: true,
        title: t('window-title-client-error'),
      }}
    >
      <main>
        <h1>{t('client-error-title')}</h1>
      </main>
    </Page>
  )
}
