import classNames from 'classnames'
import React, { HTMLAttributes } from 'react'
import * as assets from '../assets'
import style from './ReactLogo.module.css'

type Props = HTMLAttributes<HTMLElement>

export default function ReactLogo({
  className,
  ...props
}: Props) {
  return (
    <figure {...props} className={classNames(className, style.root)} dangerouslySetInnerHTML={{ __html: assets.svgs.ReactLogo }}/>
  )
}
