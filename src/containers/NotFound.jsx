import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

class NotFound extends PureComponent {
  static propTypes = {
    t: PropTypes.object.isRequired,
  };

  render() {
    const { t } = this.props;

    return (
      <Route render={(route) => {
        if (route.staticContext) {
          route.staticContext.statusCode = 404;
        }

        return (
          <StyledRoot>
            <Helmet>
              <title>{t['not-found-title']}</title>
            </Helmet>
            <h1>{t['not-found']}</h1>
          </StyledRoot>
        );
      }}/>
    );
  }
}

export default connect(
  (state) => ({
    t: state.intl.translations,
  }),
  (dispatch) => bindActionCreators({

  }, dispatch),
)(NotFound);

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  font-family: ${props => props.theme.font};
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: center;
  padding: 10% 5%;
  position: absolute;
  width: 100%;

  h1 {
    color: ${props => props.theme.titleColor};
    font-size: 2.4em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0;
    max-width: 550px;
    text-align: center;
    text-transform: uppercase;
  }
`;
