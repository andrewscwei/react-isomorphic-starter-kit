import React, { PureComponent } from 'react'
import { Route, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { I18nComponentProps, withI18n } from '../utils/i18n'

type Props = RouteComponentProps & I18nComponentProps

class NotFound extends PureComponent<Props> {
  componentDidMount() {
    if (typeof document !== 'undefined') document.title = this.props.ltxt('page-title-not-found')
  }

  render() {
    const { ltxt } = this.props

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

export default withI18n(NotFound)

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
