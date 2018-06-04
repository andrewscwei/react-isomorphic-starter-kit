import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

const StyledRoot = styled.div`
  padding: 10% 5%;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: nowrap;
  color: $white;
  box-sizing: border-box;

  & summary {
    max-width: 550px;
  }

  & > h1 {
    font-size: 2.4em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin: 0;
  }
`;

interface Props {
  t: any;
}

class NotFound extends PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <Route render={({ staticContext }) => {
        if (staticContext) {
          staticContext[`status`] = 404;
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
