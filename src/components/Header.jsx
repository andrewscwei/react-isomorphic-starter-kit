import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { getLocalizedPath } from '../utils/i18n';

const Header = ({ i18n }) => (
  <StyledRoot>
    <Link to={getLocalizedPath('/', i18n.locale)}>{i18n.ltxt('home')}</Link>
    <Link to={getLocalizedPath('/about', i18n.locale)}>{i18n.ltxt('about')}</Link>
  </StyledRoot>
);

Header.propTypes = {
  i18n: PropTypes.object.isRequired,
};

export default connect(
  (state) => ({
    i18n: state.i18n,
  }),
  (dispatch) => bindActionCreators({

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
`;
