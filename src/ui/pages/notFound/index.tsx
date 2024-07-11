import { useMetaTags } from '@lib/dom'
import { useLocalizedString } from '@lib/i18n'
import styles from './index.module.css'

export function Component() {
  const ltxt = useLocalizedString()

  useMetaTags({
    title: ltxt('window-title-not-found'),
    description: ltxt('description'),
  })

  return (
    <main>
      <h1 className={styles.title}>{ltxt('not-found-title')}</h1>
    </main>
  )
}
