import React from 'react'
import appConf from '../../app.conf'
import Head from '../components/Head'
import ReactLogo from '../components/ReactLogo'
import { useLocalizedString } from '../providers/i18n'
import style from './Home.module.css'

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
            <code className={style.version}>{appConf.version}</code>
            <span>{ltxt('description') }</span>
          </section>
        </div>
      </main>
    </>
  )
}
