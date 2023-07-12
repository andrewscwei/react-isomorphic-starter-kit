import React from 'react'
import { useLocalizedString } from '../../../arch/providers/I18nProvider'
import Head from '../../components/Head'
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
