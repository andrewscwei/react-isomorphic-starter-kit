import { useMeta } from '@lib/dom/useMeta.js'
import { useLocalizedString } from '@lib/i18n/index.js'
import { useLoaderData } from 'react-router'
import styles from './Quote.module.css'

export function Component() {
  const ltxt = useLocalizedString()
  const quote: any = useLoaderData()

  useMeta({
    title: ltxt('window-title-quote'),
  })

  return (
    <main>
      <span className={styles.title}>{ltxt('quote-title')}</span>
      {quote.text && <span className={styles.quote} id='quote'>{ltxt('quote-text', { text: quote.text })}</span>}
      {quote.author && <span className={styles.author}>{ltxt('quote-author', { author: quote.author })}</span>}
    </main>
  )
}
