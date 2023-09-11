import React, { type HTMLAttributes } from 'react'
import $$ReactLogo from '../assets/svgs/react-logo.svg'
import styles from './ReactLogo.module.css'

type Props = HTMLAttributes<HTMLElement>

export function ReactLogo({ className, ...props }: Props) {
  return (
    <figure {...props} className={`${className} ${styles.root}`} dangerouslySetInnerHTML={{ __html: $$ReactLogo }}/>
  )
}
