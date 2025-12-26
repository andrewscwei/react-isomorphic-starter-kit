import { Page } from '@/ui/containers/Page.js'
import { useLocalizedString } from '@lib/i18n'

export function Component() {
  const ltxt = useLocalizedString()

  return (
    <Page
      metadata={{
        noIndex: true,
        title: ltxt('window-title-client-error'),
      }}
    >
      <main>
        <h1>{ltxt('client-error-title')}</h1>
      </main>
    </Page>
  )
}
