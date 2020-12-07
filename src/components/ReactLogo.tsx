import $$Logo from '!!raw-loader!../assets/images/react-logo.svg'
import React, { FunctionComponent, PropsWithChildren } from 'react'
import styled from 'styled-components'

type Props = PropsWithChildren<{
  className?: string
}>

const ReactLogo: FunctionComponent<Props> = ({ className }: Props) => {
  return (
    <StyledRoot className={className} dangerouslySetInnerHTML={{ __html: $$Logo }}/>
  )
}

export default ReactLogo

const StyledRoot = styled.figure`
  animation: rotate 5s linear infinite;
  height: 100%;
  margin: 0;
  padding: 0;
  transform-origin: center;

  > svg {
    height: 100%;
    width: auto;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`
