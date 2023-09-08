import React from 'react'
import { useMetaTags } from '../../../../lib/dom'
import { useLocalizedString } from '../../../../lib/i18n'
import style from './index.module.css'

export function Component() {
  const ltxt = useLocalizedString()

  useMetaTags({ title: ltxt('window-title-not-found') })

  return (
    <main>
      <h1 className={style.title}>{ltxt('not-found-title')}</h1>
    </main>
  )
}
