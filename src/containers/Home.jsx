import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import ReactLogo from '../components/ReactLogo';

class Home extends PureComponent {
  static propTypes = {
    t: PropTypes.object.isRequired,
  };

  render() {
    const { t } = this.props;

    return (
      <StyledRoot>
        <Helmet>
          <title>{t['home']}</title>
        </Helmet>
        <StyledReactLogo/>
        <h1>{t['hello']}</h1>
        <p>{t['description']}</p>
      </StyledRoot>
    );
  }
}

export default connect(
  (state) => ({
    t: state.intl.translations,
  }),
  (dispatch) => bindActionCreators({

  }, dispatch),
)(Home);

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
    text-align: center;
  }
`;

const StyledReactLogo = styled(ReactLogo)`
  height: 200px;
  margin-bottom: 30px;
`;
