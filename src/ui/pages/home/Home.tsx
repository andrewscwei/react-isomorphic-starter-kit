import { useLocalizedString } from '@lib/i18n'
import { VERSION } from '../../../app.config.js'
import { ReactLogo } from '../../components/ReactLogo.js'
import { Page } from '../../containers/Page.js'

export function Component() {
  const ltxt = useLocalizedString()

  return (
    <Page metadata={{ title: ltxt('window-title-home') }}>
      <main>
        <div className='content'>
          <ReactLogo/>
          <section>
            <h1>{ltxt('hello')}</h1>
            <code style={{ marginBottom: '1rem' }}>{VERSION}</code>
            <span>{ltxt('description')}</span>
          </section>
        </div>
      </main>
    </Page>
  )
}
