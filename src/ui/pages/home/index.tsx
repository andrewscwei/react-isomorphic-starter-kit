import React from 'react'
import { useMetaTags } from '../../../../lib/dom'
import { useLocalizedString } from '../../../../lib/i18n'
import { ReactLogo } from '../../components/ReactLogo'
import style from './index.module.css'

export function Component() {
  const ltxt = useLocalizedString()

  useMetaTags({ title: ltxt('window-title-home') })

  return (
    <main>
      <div className={style.content}>
        <ReactLogo className={style.logo}/>
        <section>
          <h1 className={style.title}>{ltxt('hello')}</h1>
          <code className={style.version}>{__BUILD_ARGS__.version}</code>
          <span>{ltxt('description') }</span>
        </section>
      </div>
    </main>
  )
}
