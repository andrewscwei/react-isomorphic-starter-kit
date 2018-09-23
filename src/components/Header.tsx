import { AppState } from '@/store';
import React, { ReactNode, SFC } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Action, bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';

interface StateProps {
  t: TranslationData;
  locale: string;
}

interface DispatchProps {}

interface OwnProps {
  children?: ReactNode;
}

export interface Props extends StateProps, DispatchProps, OwnProps {}

const Header: SFC<Props> = ({ locale, t }) => (
  <StyledRoot>
    <Link to={locale === 'en' ? '/' : '/ja/'}>{t['home']}</Link>
    <Link to={locale === 'en' ? '/about/' : '/ja/about/'}>{t['about']}</Link>
  </StyledRoot>
);

export default connect(
  (state: AppState): StateProps => ({
    t: state.intl.translations,
    locale: state.intl.locale,
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
