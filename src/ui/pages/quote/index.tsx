import React, { Suspense } from 'react'
import { Await, LoaderFunctionArgs, defer, useLoaderData } from 'react-router'
import { useMetaTags } from '../../../../lib/dom'
import { useLocalizedString } from '../../../../lib/i18n'
import GetQuote from '../../../useCases/GetQuote'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import style from './index.module.css'

export function Component() {
  const ltxt = useLocalizedString()
  const loaderData: any = useLoaderData()

  useMetaTags({ title: ltxt('window-title-quote') })

  return (
    <>
      <Header/>
      <main>
        <Suspense>
          <Await resolve={loaderData.quote}>
            {quote => (
              <>
                {quote && <span className={style.title}>{ltxt('quote-title')}</span>}
                {quote?.text && <span className={style.quote}>{ltxt('quote-text', { text: quote.text })}</span>}
                {quote?.author && <span className={style.author}>{ltxt('quote-author', { author: quote.author })}</span>}
              </>
            )}
          </Await>
        </Suspense>
      </main>
      <Footer/>
    </>
  )
}

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  return defer({ quote: new GetQuote().run() })
}
