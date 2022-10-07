import React from 'react'
import { useLocalizedString } from '../providers/i18n'
import style from './NotFound.module.css'

export default function NotFound() {
  const ltxt = useLocalizedString()

  return (
    <>
      <main>
        <h1 className={style.title}>{ltxt('not-found-title') }</h1>
      </main>
    </>
  )
}
