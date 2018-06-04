import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import styled from 'styled-components';

const StyledRoot = styled.footer`
  padding: 0 5%;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  border-top: 1px solid #1e1e1e;
  position: fixed;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  z-index: 10;

  & nav {
    flex-grow: 1;
  }

  button {
    width: 22px;
    height: 22px;
    background: $grey;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    display: flex;
    font-size: .8em;
    padding-top: 4px;
    cursor: pointer;
    border: none;
    color: #fff;
    transition: all .2s ease-out;
    outline: none;

    &:hover {
      background: #fff;
      color: #111;
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
  }

  a {
    width: 20px;
    height: 20px;
    transition: all .2s ease-out;
    background: url('@/assets/images/github-icon.svg') center / 100% no-repeat;
    display: block;

    &:hover {
      opacity: .6;
    }
  }
`;

interface Props {
  t: any;
  i18n: any;
}

class Footer extends PureComponent<Props> {
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
