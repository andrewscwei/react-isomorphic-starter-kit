import React, { HTMLAttributes } from 'react'
import $$ReactLogo from '../assets/svgs/react-logo.svg'
import style from './ReactLogo.module.css'

type Props = HTMLAttributes<HTMLElement>

export default function ReactLogo({
  className,
  ...props
}: Props) {
  return (
    <figure {...props} className={`${className} ${style.root}`} dangerouslySetInnerHTML={{ __html: $$ReactLogo }}/>
  )
}
