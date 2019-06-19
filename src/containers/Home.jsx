import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import ReactLogo from '../components/ReactLogo';
import withPageTitle from '../decorators/withPageTitle';

@connect(
  (state) => ({
    ltxt: state.i18n.ltxt,
  }),
  (dispatch) => bindActionCreators({

  }, dispatch),
)
@withPageTitle('home')
export default class Home extends PureComponent {
  static propTypes = {
    ltxt: PropTypes.func.isRequired,
  };

  render() {
    const { ltxt } = this.props;

    return (
      <StyledRoot>
        <StyledReactLogo/>
        <h1>{ltxt('hello')}</h1>
        <p>v{__BUILD_CONFIG__.version} ({__BUILD_CONFIG__.buildNumber})</p>
        <p>{ltxt('description')}</p>
      </StyledRoot>
    );
  }
}

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  font-family: ${props => props.theme.font};
  height: 100%;
  justify-content: center;
  padding: 10% 5%;
  position: absolute;
  width: 100%;

  h1 {
    color: ${props => props.theme.titleColor};
    font-size: 5em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0;
    max-width: 550px;
    text-align: center;
    text-transform: uppercase;
  }

  p {
    color: ${props => props.theme.textColor};
    font-weight: 400;
    letter-spacing: .6px;
    line-height: 1.6em;
    max-width: 400px;
    margin: 0;
    text-align: center;
  }
`;

const StyledReactLogo = styled(ReactLogo)`
  height: 200px;
  margin-bottom: 30px;
`;
