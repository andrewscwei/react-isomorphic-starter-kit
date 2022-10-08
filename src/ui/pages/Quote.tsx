import React, { useEffect } from 'react'
import Head from '../components/Head'
import { GetQuote } from '../interactors'
import useFetch from '../interactors/hooks/useFetch'
import { useLocalizedString } from '../providers/i18n'
import style from './Quote.module.css'

export default function About() {
  const ltxt = useLocalizedString()
  const { interact: getQuote, value: quote } = useFetch(GetQuote)

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
