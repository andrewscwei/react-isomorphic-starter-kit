import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

const StyledRoot = styled.div`
  align-items: flex-start;
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

  & summary {
    max-width: 550px;
  }

  & h1 {
    color: ${props => props.theme.titleColor};
    font-size: 5em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0;
    text-transform: uppercase;
  }

  & p {
    color: ${props => props.theme.textColor};
    font-weight: 400;
    letter-spacing: .6px;
    line-height: 1.6em;
  }
`;

interface Props {
  t: TranslationData;
}

const mapStateToProps = (state: any): Partial<Props> => ({ t: state.intl.translations });
const mapDispatchToProps = (dispatch: any): Partial<Props> => bindActionCreators({}, dispatch);

class Home extends PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <StyledRoot>
        <summary>
          <h1>{t[`hello`]}</h1>
          <p>{t[`description`]}</p>
        </summary>
      </StyledRoot>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
