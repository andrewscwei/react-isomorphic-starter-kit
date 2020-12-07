import React, { FunctionComponent, PropsWithChildren } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Action, bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'
import { AppState } from '../store'
import { I18nState } from '../store/i18n'
import { getLocalizedPath } from '../utils/i18n'

type StateProps = {
  i18n: I18nState
}

type DispatchProps = {}

type Props = StateProps & DispatchProps & PropsWithChildren<{}>

const Header: FunctionComponent<Props> = ({ i18n }: Props) => {
  return (
    <StyledRoot>
      <Link to={getLocalizedPath('/', i18n.locale)}>{i18n.ltxt('home')}</Link>
      <Link to={getLocalizedPath('/about', i18n.locale)}>{i18n.ltxt('about')}</Link>
    </StyledRoot>
  )
}

export default connect(
  (state: AppState): StateProps => ({
    i18n: state.i18n,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({

  }, dispatch),
)(Header)

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
