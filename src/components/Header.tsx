import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledRoot = styled.header`
  padding: 0 5%;
  width: 100%;
  height: 70px;
  background: #111;
  position: fixed;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 10;

  > a {
    color: #fff;
    text-decoration: none;
    transition: all .2s ease-out;
    font-weight: 400;
    letter-spacing: 1px;
    font-size: .8em;
    cursor: pointer;
    text-transform: uppercase;

    &:not(:last-child) {
      margin-right: 20px;
    }

    &:hover {
      opacity: .6;
    }
  }
`;

interface Props {
  t: any;
}

class Header extends PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <StyledRoot>
        <Link to='/'>{t(`home`)}</Link>
        <Link to='/about'>{t(`about`)}</Link>
      </StyledRoot>
    );
  }
}

export default translate()(Header);
