import React, { ReactNode, SFC } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Action, bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import { getLocalizedPath } from '../routes/client';
import { AppState } from '../store';
import { I18nState } from '../store/i18n';

interface StateProps {
  ltxt: I18nState['ltxt'];
  locale: string;
}

interface DispatchProps {}

interface OwnProps {
  children?: ReactNode;
}

export interface Props extends StateProps, DispatchProps, OwnProps {}

const Header: SFC<Props> = ({ locale, ltxt }) => (
  <StyledRoot>
    <Link to={getLocalizedPath('/', locale)}>{ltxt('home')}</Link>
    <Link to={getLocalizedPath('/about', locale)}>{ltxt('about')}</Link>
  </StyledRoot>
);

export default connect(
  (state: AppState): StateProps => ({
    ltxt: state.i18n.ltxt,
    locale: state.i18n.locale,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({

  }, dispatch),
)(Header);

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
    color: ${props => props.theme.linkColor};
    cursor: pointer;
    font-family: ${props => props.theme.font};
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
`;
