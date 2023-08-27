import type { HTMLAttributes } from 'react'
import React from 'react'
import { useChangeLocale, useLocalizedString } from '../../../lib/i18n'
import $$GitHubLogo from '../assets/images/github-logo.svg'
import style from './Footer.module.css'

type Props = HTMLAttributes<HTMLElement>

export function Footer({ ...props }: Props) {
  const ltxt = useLocalizedString()
  const changeLocale = useChangeLocale()

  return (
    <footer {...props} className={style.root}>
      <nav className={style.nav}>
        <a href='https://github.com/andrewscwei/react-isomorphic-starter-kit'>
          <img src={$$GitHubLogo} alt='GitHub' />
        </a>
      </nav>
      <button className={style.button} onClick={() => changeLocale('en')}>{ltxt('en')}</button>
      <button className={style.button} onClick={() => changeLocale('ja')}>{ltxt('ja')}</button>
    </footer>
  )
}
