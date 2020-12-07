import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps } from 'react-router-dom'
import { Action, bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'
import { AppState } from '../store'
import { I18nState } from '../store/i18n'

type StateProps = {
  i18n: I18nState
}

type Props = StateProps & RouteComponentProps

class NotFound extends PureComponent<Props> {
  componentDidMount() {
    if (typeof document !== 'undefined') document.title = this.props.i18n.ltxt('not-found')
  }

  render() {
    const { ltxt } = this.props.i18n

    return (
      <Route render={(route: RouteComponentProps<any>) => {
        if (route.staticContext) {
          route.staticContext.statusCode = 404
        }

        return (
          <StyledRoot>
            <h1>{ltxt('not-found-title')}</h1>
          </StyledRoot>
        )
      }}/>
    )
  }
}

export default connect(
  (state: AppState): StateProps => ({
    i18n: state.i18n,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({

  }, dispatch),
)(NotFound)

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  font-family: ${props => props.theme.fonts.body};
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: center;
  padding: 10% 5%;
  position: absolute;
  width: 100%;

  h1 {
    color: ${props => props.theme.colors.title};
    font-size: 2.4em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0;
    max-width: 550px;
    text-align: center;
    text-transform: uppercase;
  }
`
