import { IntlProps } from '@/types';
import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import styled from 'styled-components';

const StyledRoot = styled.footer`
  align-items: center;
  border-top: 1px solid #1e1e1e;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  font-family: ${props => props.theme.font};
  height: 50px;
  justify-content: flex-start;
  left: 0;
  padding: 0 5%;
  width: 100%;
  position: fixed;
  z-index: 10;

  & nav {
    flex-grow: 1;
  }

  & button {
    align-items: center;
    background: ${props => props.theme.buttonColor};
    border: none;
    box-sizing: border-box;
    color: ${props => props.theme.buttonTextColor};
    cursor: pointer;
    display: flex;
    font-size: .8em;
    height: 22px;
    justify-content: center;
    outline: none;
    padding-top: 4px;
    transition: all .2s ease-out;
    width: 22px;

    &:hover {
      background: ${props => props.theme.buttonHoverColor};
      color: ${props => props.theme.buttonHoverTextColor};
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
  }

  & a {
    background: url(${require(`@/assets/images/github-icon.svg`)}) center / 100% no-repeat;
    display: block;
    height: 20px;
    transition: all .2s ease-out;
    width: 20px;

    &:hover {
      opacity: .6;
    }
  }
`;

class Footer extends PureComponent<IntlProps> {
  render() {
    const { t, i18n } = this.props;

    return (
      <StyledRoot>
        <nav>
          <a href='https://github.com/andrewscwei/react-universal-starter-kit'/>
        </nav>
        <button onClick={() => i18n.changeLanguage(`en`)}>{t(`en`)}</button>
        <button onClick={() => i18n.changeLanguage(`jp`)}>{t(`jp`)}</button>
      </StyledRoot>
    );
  }
}

export default translate()(Footer);
