import { VERSION } from '@/app.config.js'
import { ReactLogo } from '@/ui/components/ReactLogo.js'
import { Page } from '@/ui/containers/Page.js'
import { useLocalizedString } from '@lib/i18n'

export function Component() {
  const ltxt = useLocalizedString()

  return (
    <Page metadata={{ title: ltxt('window-title-home') }}>
      <main>
        <div className='content'>
          <ReactLogo/>
          <div>
            <h1>{ltxt('hello')}</h1>
            <code style={{ marginBottom: '1rem' }}>{VERSION}</code>
            <span>{ltxt('description')}</span>
          </div>
        </div>
      </main>
    </Page>
  )
}
