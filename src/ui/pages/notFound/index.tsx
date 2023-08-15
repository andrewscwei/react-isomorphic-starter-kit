import React from 'react'
import { useMetaTags } from '../../../../lib/dom'
import { useLocalizedString } from '../../../../lib/i18n'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import style from './index.module.css'

export function Component() {
  const ltxt = useLocalizedString()

  useMetaTags({ title: ltxt('window-title-not-found') })

  return (
    <>
      <Header/>
      <main>
        <h1 className={style.title}>{ltxt('not-found-title') }</h1>
      </main>
      <Footer/>
    </>
  )
}
