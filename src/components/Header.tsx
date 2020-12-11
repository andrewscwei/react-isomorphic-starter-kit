import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { getLocalizedPath, I18nComponentProps, withI18n } from '../utils/i18n'

type Props = I18nComponentProps

const Header: FunctionComponent<Props> = ({ locale, ltxt }) => (
  <StyledRoot>
    <Link to={getLocalizedPath('/', locale)}>{ltxt('page-title-home')}</Link>
    <Link to={getLocalizedPath('/about', locale)}>{ltxt('page-title-about')}</Link>
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
    color: ${props => props.theme.colors.link};
    cursor: pointer;
    font-family: ${props => props.theme.fonts.body};
    font-size: .8em;
    font-weight: 400;
    letter-spacing: 1px;
    text-decoration: none;
    text-transform: uppercase;
    transition: all .2s ease-out;

    :hover {
      opacity: .6;
    }

    :not(:last-child) {
      margin-right: 20px;
    }
  }
`
