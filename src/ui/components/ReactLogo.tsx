import { type HTMLAttributes } from 'react'
import ReactLogoSVG from '../assets/svgs/react-logo.svg?react'
import styles from './ReactLogo.module.css'

type Props = HTMLAttributes<HTMLElement>

export function ReactLogo({ className, ...props }: Readonly<Props>) {
  return (
    <figure {...props} className={`${styles.root} ${className}`}>
      <ReactLogoSVG/>
    </figure>
  )
}
