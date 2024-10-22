import { useMeta } from '@lib/dom/index.js'
import { useLocalizedString } from '@lib/i18n/index.js'
import { VERSION } from '../../../app.config.js'
import { ReactLogo } from '../../components/ReactLogo.js'

export function Component() {
  const ltxt = useLocalizedString()

  useMeta({
    title: ltxt('window-title-home'),
  })

  return (
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
  )
}
