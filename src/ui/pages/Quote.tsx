import React, { useEffect } from 'react'
import Head from '../components/Head'
import { GetQuote } from '../interactors'
import useFetch from '../interactors/hooks/useFetch'
import { useLocalizedString } from '../providers/i18n'
import { useLocals } from '../providers/locals'
import style from './Quote.module.css'

export default function About() {
  const ltxt = useLocalizedString()
  const locals = useLocals()

  const { interact: getQuote, value: quote } = useFetch(GetQuote, { defaultValue: locals.prefetched })

  useEffect(() => {
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
