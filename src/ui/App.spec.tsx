import { render } from '@testing-library/react'
import React from 'react'
import App from './App'

describe('App', () => {
  it('should render without throwing an error', () => {
    render(<App/>)
  })
})
