import ReactLogo from '@/components/ReactLogo';
import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

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

  & h1 {
    color: ${props => props.theme.titleColor};
    font-size: 5em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0;
    max-width: 550px;
    text-align: center;
    text-transform: uppercase;
  }

  & p {
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

interface StateProps {
  t: TranslationData;
}

interface DispatchProps {

}

interface OwnProps {

}

type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps = (state: any, ownProps: OwnProps): StateProps => ({ t: state.intl.translations });
const mapDispatchToProps = (dispatch: any, ownProps: OwnProps): DispatchProps => bindActionCreators({}, dispatch);

class Home extends PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <StyledRoot>
        <Helmet>
          <title>{t[`home`]}</title>
        </Helmet>
        <StyledReactLogo/>
        <h1>{t[`hello`]}</h1>
        <p>{t[`description`]}</p>
      </StyledRoot>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(Home);
