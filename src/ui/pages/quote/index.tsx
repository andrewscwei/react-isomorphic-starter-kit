import React from 'react'
import { useLoaderData } from 'react-router'
import { useMetaTags } from '../../../../lib/dom'
import { useLocalizedString } from '../../../../lib/i18n'
import { GetQuote, type Quote } from '../../../useCases/GetQuote'
import style from './index.module.css'

export function Component() {
  const ltxt = useLocalizedString()
  const quote = useLoaderData() as Quote

  useMetaTags({ title: ltxt('window-title-quote') })

  return (
    <main>
      {quote && <span className={style.title}>{ltxt('quote-title')}</span>}
      {quote?.text && <span className={style.quote}>{ltxt('quote-text', { text: quote.text })}</span>}
      {quote?.author && <span className={style.author}>{ltxt('quote-author', { author: quote.author })}</span>}
    </main>
  )
}

export async function loader() {
  return new GetQuote().run()
}
