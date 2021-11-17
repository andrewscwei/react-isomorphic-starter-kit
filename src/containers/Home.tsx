import React, { ComponentType, PureComponent } from 'react'
import styled from 'styled-components'
import ReactLogo from '../components/ReactLogo'
import { I18nComponentProps, withI18n } from '../utils/i18n'

type Props = I18nComponentProps

class Home extends PureComponent<Props> {

  componentDidMount() {
    if (typeof document !== 'undefined') document.title = this.props.ltxt('window-title-home')
  }

  render() {
    const { ltxt } = this.props

    return (
      <StyledRoot>
        <StyledReactLogo/>
        <h1>{ltxt('hello')}</h1>
        <pre>v{__BUILD_CONFIG__.version} ({__BUILD_CONFIG__.buildNumber})</pre>
        <p>{ltxt('description')}</p>
      </StyledRoot>
    )
  }
}

export default withI18n(Home)

const StyledRoot = styled.div`
  ${props => props.theme.layout.hp}
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: center;
  position: absolute;
  width: 100%;

  h1 {
    ${props => props.theme.texts.h1}
    color: ${props => props.theme.colors.white};
    margin: 0;
    max-width: 550px;
    text-align: center;
  }

  pre {
    ${props => props.theme.texts.m1}
    color: ${props => props.theme.colors.grey};
    text-align: center;
  }

  p {
    ${props => props.theme.texts.p1}
    color: ${props => props.theme.colors.grey};
    margin: 0;
    max-width: 400px;
    text-align: center;
  }
`

const StyledReactLogo = styled(ReactLogo as ComponentType)`
  height: 200px;
  margin-bottom: 30px;
`
