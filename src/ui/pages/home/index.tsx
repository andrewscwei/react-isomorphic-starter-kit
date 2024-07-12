import { useMetaTags } from '@lib/dom'
import { useLocalizedString } from '@lib/i18n'
import { VERSION } from '../../../app.conf'
import { ReactLogo } from '../../components/ReactLogo'
import styles from './index.module.css'

export function Component() {
  const ltxt = useLocalizedString()

  useMetaTags({
    title: ltxt('window-title-home'),
    description: ltxt('description'),
  })

  return (
    <main>
      <div className={styles.content}>
        <ReactLogo className={styles.logo}/>
        <section>
          <h1 className={styles.title}>{ltxt('hello')}</h1>
          <code className={styles.version}>{VERSION}</code>
          <span>{ltxt('description')}</span>
        </section>
      </div>
    </main>
  )
}
