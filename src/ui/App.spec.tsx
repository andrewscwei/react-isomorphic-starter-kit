import { render, waitFor } from '@testing-library/react'
import React from 'react'
import App from './App'

describe('App', () => {
  it('should render without throwing an error', async () => {
    const { asFragment } = render(<App/>)

    await waitFor(() => asFragment())
  })
})
