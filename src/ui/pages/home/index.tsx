import React from 'react'
import { VERSION } from '../../../app.conf'
import Head from '../../../base/components/Head'
import { useLocalizedString } from '../../../base/providers/I18nProvider'
import ReactLogo from '../../components/ReactLogo'
import style from './index.module.css'

export default function Home() {
  const ltxt = useLocalizedString()

  return (
    <>
      <Head title={ltxt('window-title-home')}/>
      <main>
        <div className={style.content}>
          <ReactLogo className={style.logo}/>
          <section>
            <h1 className={style.title}>{ltxt('hello')}</h1>
            <code className={style.version}>{VERSION}</code>
            <span>{ltxt('description') }</span>
          </section>
        </div>
      </main>
    </>
  )
}