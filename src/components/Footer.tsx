import { AppState } from '@/store';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Action, bindActionCreators, Dispatch } from 'redux';
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

  & nav > a {
    background: url(${require(`@/assets/images/github-icon.svg`)}) center / 100% no-repeat;
    display: block;
    height: 20px;
    transition: all .2s ease-out;
    width: 20px;

    &:hover {
      opacity: .6;
    }
  }

  & > a {
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
    text-decoration: none;
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
`;

interface StateProps {
  t: TranslationData;
}

interface DispatchProps {}

interface OwnProps {}

interface Props extends StateProps, DispatchProps, OwnProps {}

const mapStateToProps = (state: AppState): StateProps => ({
  t: state.intl.translations,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({

}, dispatch);

class Footer extends PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <StyledRoot>
        <nav>
          <a href='https://github.com/andrewscwei/react-isomorphic-starter-kit'/>
        </nav>
        <Link to='/'>{t[`en`]}</Link>
        <Link to='/ja/'>{t[`jp`]}</Link>
      </StyledRoot>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
