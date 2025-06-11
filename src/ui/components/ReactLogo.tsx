import { type HTMLAttributes } from 'react'
import $$ReactLogo from '../../assets/svgs/react-logo.svg?raw'

type Props = HTMLAttributes<HTMLElement>

export function ReactLogo({ className, ...props }: Readonly<Props>) {
  return (
    <figure
      {...props}
      className={`${className} logo`}
      dangerouslySetInnerHTML={{ __html: $$ReactLogo }}
    />
  )
}
