import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import { Route, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { IntlProps } from '@/types';

const StyledRoot = styled.div`
  align-items: flex-start;
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

  & summary {
    max-width: 550px;
  }

  & h1 {
    color: ${props => props.theme.titleColor};
    font-size: 2.4em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0;
    text-transform: uppercase;
  }
`;

class NotFound extends PureComponent<IntlProps> {
  render() {
    const { t } = this.props;

    return (
      <Route render={(route: RouteComponentProps<any>) => {
        if (route.staticContext) {
          route.staticContext.statusCode = 404;
        }

        return (
          <StyledRoot>
            <summary>
              <h1>{t(`not-found`)}</h1>
            </summary>
          </StyledRoot>
        );
      }}/>
    );
  }
}

export default translate()(NotFound);
