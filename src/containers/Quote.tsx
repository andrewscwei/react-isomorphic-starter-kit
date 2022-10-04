import React, { useEffect } from 'react'
import styled from 'styled-components'
import useFetch from '../hooks/useFetch'
import useWindowTitle from '../hooks/useWindowTitle'
import GetQuote from '../interactors/useCases/GetQuote'
import { useLtxt } from '../utils/i18n'

export default function Quote() {
  const ltxt = useLtxt()
  const { interact: getQuote, value: quote } = useFetch(GetQuote)

  useWindowTitle(ltxt('window-title-quote'))

  useEffect(() => {
    getQuote()
  }, [])

  return (
    <StyledRoot>
      <h1>{ltxt('quote-title')}</h1>
      {quote?.text && <span>{ltxt('quote-text', { text: quote.text })}</span>}
      {quote?.author && <span>{ltxt('quote-author', { author: quote.author })}</span>}
    </StyledRoot>
  )
}

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
    ${props => props.theme.texts.h2}
    color: ${props => props.theme.colors.white};
    margin: 0 0 20px;
    max-width: 550px;
    text-align: center;
  }

  span {
    ${props => props.theme.texts.p1}
    color: ${props => props.theme.colors.grey};
    text-align: center;
  }
`
