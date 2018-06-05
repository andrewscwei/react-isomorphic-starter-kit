import { TranslationData } from '@/types';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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

    &:hover {
      opacity: .6;
    }

    &:not(:last-child) {
      margin-right: 20px;
    }
  }
`;

interface Props {
  t: TranslationData;
  locale: string;
}

class Header extends PureComponent<Props> {
  render() {
    const { locale, t } = this.props;

    return (
      <StyledRoot>
        <Link to={locale === `en` ? `/` : `/ja/`}>{t[`home`]}</Link>
        <Link to={locale === `en` ? `/about/` : `/ja/about/`}>{t[`about`]}</Link>
      </StyledRoot>
    );
  }
}

export default Header;
