import React, { PropsWithChildren, ReactElement } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Action, bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import { AppState } from '../store';
import { I18nState } from '../store/i18n';
import { getLocalizedPath } from '../utils/i18n';

interface StateProps {
  i18n: I18nState;
}

interface DispatchProps {

}

type OwnProps = PropsWithChildren<{

}>;

interface Props extends StateProps, DispatchProps, OwnProps {}

function Footer({ i18n }: Props): ReactElement {
  return (
    <StyledRoot>
      <nav>
        <a href='https://github.com/andrewscwei/react-isomorphic-starter-kit'/>
      </nav>
      <Link to={getLocalizedPath('/', 'en')}>{i18n.ltxt('en')}</Link>
      <Link to={getLocalizedPath('/', 'ja')}>{i18n.ltxt('jp')}</Link>
    </StyledRoot>
  );
}

export default connect(
  (state: AppState): StateProps => ({
    i18n: state.i18n,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({

  }, dispatch),
)(Footer);

const StyledRoot = styled.footer`
  align-items: center;
  border-top: 1px solid #1e1e1e;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  font-family: ${(props) => props.theme.fonts.body};
  height: 50px;
  justify-content: flex-start;
  left: 0;
  padding: 0 5%;
  width: 100%;
  position: fixed;
  z-index: 10;

  nav {
    flex-grow: 1;
  }

  nav > a {
    background: url(${require('../assets/images/github-icon.svg')}) center / 100% no-repeat;
    display: block;
    height: 20px;
    transition: all .2s ease-out;
    width: 20px;

    :hover {
      opacity: .6;
    }
  }

  > a {
    align-items: center;
    background: ${(props) => props.theme.colors.button};
    border: none;
    box-sizing: border-box;
    color: ${(props) => props.theme.colors.buttonText};
    cursor: pointer;
    display: flex;
    font-size: .8em;
    height: 22px;
    justify-content: center;
    outline: none;
    padding-top: 4px;
    text-decoration: none;
    transition: all .2s ease-out;
    width: 22px;

    :hover {
      background: ${(props) => props.theme.colors.buttonHover};
      color: ${(props) => props.theme.colors.buttonHoverText};
    }

    :not(:last-child) {
      margin-right: 10px;
    }
  }
`;
