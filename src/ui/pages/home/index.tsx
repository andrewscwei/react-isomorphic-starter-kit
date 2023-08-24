import React from 'react'
import { useMetaTags } from '../../../../lib/dom'
import { useLocalizedString } from '../../../../lib/i18n'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import ReactLogo from '../../components/ReactLogo'
import style from './index.module.css'

export function Component() {
  const ltxt = useLocalizedString()

  useMetaTags({ title: ltxt('window-title-home') })

  return (
    <>
      <Header/>
      <main>
        <div className={style.content}>
          <ReactLogo className={style.logo}/>
          <section>
            <h1 className={style.title}>{ltxt('hello')}</h1>
            <code className={style.version}>{window.__VERSION__}</code>
            <span>{ltxt('description') }</span>s
          </section>
        </div>
      </main>
      <Footer/>
    </>
  )
}
