import { useLocalizedString } from '@lib/i18n'
import { Page } from '../../containers/Page.js'

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
