import { Page } from '@/ui/containers/Page.js'
import { useI18n } from '@lib/i18n'

export function Component() {
  const { t } = useI18n()

  return (
    <Page
      metadata={{
        noIndex: true,
        title: t('window-title-not-found'),
      }}
    >
      <main>
        <h1>{t('not-found-title')}</h1>
      </main>
    </Page>
  )
}
