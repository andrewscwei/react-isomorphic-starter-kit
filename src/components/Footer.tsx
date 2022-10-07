import classNames from 'classnames'
import React, { HTMLAttributes } from 'react'
import { useChangeLocale, useLocalizedString } from '../providers/i18n'
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
        <a href='https://github.com/andrewscwei/react-static-starter-kit'/>
      </nav>
      <button className={style.button} onClick={() => changeLocale('en')}>{ltxt('en')}</button>
      <button className={style.button} onClick={() => changeLocale('jp')}>{ltxt('jp')}</button>
    </footer>
  )
}
