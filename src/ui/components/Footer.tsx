import classNames from 'classnames'
import React, { HTMLAttributes } from 'react'
import { useChangeLocale, useLocalizedString } from '../../arch/providers/I18nProvider'
import $$GitHubLogo from '../assets/images/github-logo.svg'
import style from './Footer.module.css'

type Props = HTMLAttributes<HTMLElement>

export default function Footer({
  className,
  ...props
}: Props) {
  const ltxt = useLocalizedString()
  const changeLocale = useChangeLocale()

  return (
    <footer {...props} className={classNames(className, style.root)}>
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
