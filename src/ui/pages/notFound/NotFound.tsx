import { useLocalizedString } from '@lib/i18n'
import { Page } from '../../containers/Page.js'

export function Component() {
  const ltxt = useLocalizedString()

  return (
    <Page metadata={{ noIndex: true, title: ltxt('not-found-title') }}>
      <main>
        <h1>{ltxt('not-found-title')}</h1>
      </main>
    </Page>
  )
}
