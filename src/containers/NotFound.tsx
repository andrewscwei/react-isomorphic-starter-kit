import React, { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components'
import { I18nComponentProps, withI18n } from '../utils/i18n'

type Props = I18nComponentProps

const NotFound: FunctionComponent<Props> = ({ ltxt }) => {
  useEffect(() => {
    if (typeof document !== 'undefined') document.title = ltxt('window-title-not-found')
  }, [])

  return (
    <StyledRoot>
      <h1>{ltxt('not-found-title')}</h1>
    </StyledRoot>
  )
}

export default withI18n(NotFound)

const StyledRoot = styled.div`
  ${props => props.theme.layout.ph}
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: center;
  position: absolute;
  width: 100%;

  h1 {
    ${props => props.theme.texts.h2}
    color: ${props => props.theme.colors.white};
    margin: 0;
    max-width: 550px;
    text-align: center;
  }
`
