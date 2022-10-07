import React from 'react'
import ReactLogo from '../components/ReactLogo'
import { useLocalizedString } from '../providers/i18n'
import style from './Home.module.css'

export default function Home() {
  const ltxt = useLocalizedString()

  return (
    <>
      <main>
        <div className={style.content}>
          <ReactLogo className={style.logo}/>
          <section>
            <h1 className={style.title}>{ltxt('hello')}</h1>
            <code className={style.version}>{`v${__CONFIG__.version} (${__CONFIG__.buildNumber})`}</code>
            <span>{ltxt('description') }</span>
          </section>
        </div>
      </main>
    </>
  )
}
