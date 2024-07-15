import { useMeta } from '@lib/dom/index.js'
import { useLocalizedString } from '@lib/i18n/index.js'
import styles from './index.module.css'

export function Component() {
  const ltxt = useLocalizedString()

  useMeta({
    title: ltxt('window-title-not-found'),
    description: ltxt('description'),
    url: typeof window === 'undefined' ? undefined : window.location.hostname + window.location.pathname,
  })

  return (
    <main>
      <h1 className={styles.title}>{ltxt('not-found-title')}</h1>
    </main>
  )
}
