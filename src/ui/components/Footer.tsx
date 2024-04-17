import { useChangeLocale, useLocalizedString, useResetLocale } from '@lib/i18n'
import React, { type HTMLAttributes } from 'react'
import $$GitHubLogo from '../assets/images/github-logo.svg'
import * as styles from './Footer.module.css'

type Props = HTMLAttributes<HTMLElement>

export function Footer({ ...props }: Readonly<Props>) {
  const ltxt = useLocalizedString()
  const resetLocale = useResetLocale()
  const changeLocale = useChangeLocale()

  return (
    <footer {...props} className={styles.root}>
      <nav className={styles.nav}>
        <a href='https://github.com/andrewscwei/react-isomorphic-starter-kit'>
          <img src={$$GitHubLogo} alt='GitHub' />
        </a>
      </nav>
      <button className={styles.button} onClick={() => resetLocale()}>{ltxt('en')}</button>
      <button className={styles.button} onClick={() => changeLocale('ja')}>{ltxt('ja')}</button>
    </footer>
  )
}
