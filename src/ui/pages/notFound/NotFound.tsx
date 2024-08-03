import { useMeta } from '@lib/dom/index.js'
import { useLocalizedString } from '@lib/i18n/index.js'
import styles from './NotFound.module.css'

export function Component() {
  const ltxt = useLocalizedString()

  useMeta({
    title: ltxt('window-title-not-found'),
  })

  return (
    <main>
      <h1 className={styles.title}>{ltxt('not-found-title')}</h1>
    </main>
  )
}
