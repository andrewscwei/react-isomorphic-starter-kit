import classNames from 'classnames'
import React, { HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { useLocalizedPath, useLocalizedString } from '../../base/providers/I18nProvider'
import style from './Header.module.css'

type Props = HTMLAttributes<HTMLElement>

export default function Header({
  className,
  ...props
}: Props) {
  const ltxt = useLocalizedString()
  const lpath = useLocalizedPath()

  return (
    <header {...props} className={classNames(className, style.root)}>
      <Link className={style.link} to={lpath('/')}>{ltxt('nav-title-home') }</Link>
      <Link className={style.link} to={lpath('/quote')}>{ltxt('nav-title-quote') }</Link>
    </header>
  )
}
