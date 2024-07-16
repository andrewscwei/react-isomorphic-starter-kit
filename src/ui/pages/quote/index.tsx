import { useMeta } from '@lib/dom/useMeta.js'
import { useLocalizedString } from '@lib/i18n/index.js'
import { useLoaderData } from 'react-router'
import { type Quote } from '../../../useCases/GetQuote.js'
import styles from './index.module.css'

export function Component() {
  const ltxt = useLocalizedString()
  const quote = useLoaderData() as Quote

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
