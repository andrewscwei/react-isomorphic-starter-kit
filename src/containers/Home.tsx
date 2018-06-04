import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
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
  color: #fff;
  box-sizing: border-box;

  & summary {
    max-width: 550px;
  }

  & h1 {
    font-size: 5em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin: 0;
  }

  & description {
    font-weight: 400;
    letter-spacing: .6px;
    line-height: 1.4em;
    color: #666;
  }
`;

interface Props {
  t: any;
}

class Home extends PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <StyledRoot>
        <summary>
          <h1>{t(`hello`)}</h1>
          <p>{t(`description`)}</p>
        </summary>
      </StyledRoot>
    );
  }
}

export default translate()(Home);
