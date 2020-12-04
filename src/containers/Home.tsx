import React, { ComponentType, PureComponent } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Action, bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'
import ReactLogo from '../components/ReactLogo'
import { AppState } from '../store'
import { I18nState } from '../store/i18n'

interface StateProps {
  i18n: I18nState
}

interface DispatchProps {

}

type OwnProps = RouteComponentProps<{

}>

interface Props extends StateProps, DispatchProps, OwnProps {}

interface State {

}

class Home extends PureComponent<Props, State> {
  componentDidMount() {
    if (typeof document !== 'undefined') document.title = this.props.i18n.ltxt('home')
  }

  render() {
    const { ltxt } = this.props.i18n

    return (
      <StyledRoot>
        <StyledReactLogo/>
        <h1>{ltxt('hello')}</h1>
        <p>v{__BUILD_CONFIG__.version} ({__BUILD_CONFIG__.buildNumber})</p>
        <p>{ltxt('description')}</p>
      </StyledRoot>
    )
  }
}

export default connect(
  (state: AppState): StateProps => ({
    i18n: state.i18n,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({

  }, dispatch),
)(Home)

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  font-family: ${props => props.theme.fonts.body};
  height: 100%;
  justify-content: center;
  padding: 10% 5%;
  position: absolute;
  width: 100%;

  h1 {
    color: ${props => props.theme.colors.title};
    font-size: 5em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0;
    max-width: 550px;
    text-align: center;
    text-transform: uppercase;
  }

  p {
    color: ${props => props.theme.colors.text};
    font-weight: 400;
    letter-spacing: .6px;
    line-height: 1.6em;
    max-width: 400px;
    margin: 0;
    text-align: center;
  }
`

const StyledReactLogo = styled(ReactLogo as ComponentType)`
  height: 200px;
  margin-bottom: 30px;
`
