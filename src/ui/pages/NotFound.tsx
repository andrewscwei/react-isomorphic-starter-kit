import React from 'react'
import Head from '../components/Head'
import { useLocalizedString } from '../providers/I18nProvider'
import style from './NotFound.module.css'

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
