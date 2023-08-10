import React, { useEffect } from 'react'
import Head from '../../../base/components/Head'
import { useInteractor } from '../../../base/interactors/Interactor'
import { useLocalizedString } from '../../../base/providers/I18nProvider'
import { useLocals } from '../../../base/providers/LocalsProvider'
import GetQuote from '../../../useCases/GetQuote'
import style from './index.module.css'

export default function About() {
  const ltxt = useLocalizedString()
  const locals = useLocals()

  const { run: getQuote, value: quote } = useInteractor(GetQuote, { defaultValue: locals.prefetched })

  useEffect(() => {
    // Uncomment to always use prefetched quote.
    // if (quote) return
    getQuote()
  }, [])

  return (
    <>
      <Head title={ltxt('window-title-quote')}/>
      <main>
        {quote && <span className={style.title}>{ltxt('quote-title')}</span>}
        {quote?.text && <span className={style.quote}>{ltxt('quote-text', { text: quote.text })}</span>}
        {quote?.author && <span className={style.author}>{ltxt('quote-author', { author: quote.author })}</span>}
      </main>
    </>
  )
}

export async function prefetch() {
  return new GetQuote().run()
}