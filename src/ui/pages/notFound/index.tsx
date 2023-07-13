import React from 'react'
import Head from '../../../base/components/Head'
import { useLocalizedString } from '../../../base/providers/I18nProvider'
import style from './index.module.css'

export default function NotFound() {
  const ltxt = useLocalizedString()

  return (
    <>
      <Head title={ltxt('window-title-not-found')}/>
      <main>
        <h1 className={style.title}>{ltxt('not-found-title') }</h1>
      </main>
    </>
  )
}
