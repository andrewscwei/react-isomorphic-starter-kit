import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { getLocalizedPath, I18nComponentProps, withI18n } from '../utils/i18n'

type Props = I18nComponentProps & {
  className?: string
}

const Header: FunctionComponent<Props> = ({ className, ltxt, locale }) => (
  <StyledRoot className={className}>
    <Link to={getLocalizedPath('/', locale)}>{ltxt('window-title-home') }</Link>
    <Link to={getLocalizedPath('/about', locale)}>{ltxt('window-title-about') }</Link>
  </StyledRoot>
)

export default withI18n(Header)

const StyledRoot = styled.header`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  height: 70px;
  justify-content: flex-end;
  padding: 0 5%;
  position: fixed;
  width: 100%;
  z-index: 10;

  > a {
    ${props => props.theme.texts.n1};
    color: ${props => props.theme.colors.white};
    cursor: pointer;
    transition: all .2s ease-out;

    :hover {
      opacity: .6;
    }

    :not(:last-child) {
      margin-right: 20px;
    }
  }
`
