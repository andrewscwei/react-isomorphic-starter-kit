import { render, waitFor } from '@testing-library/react'
import { App } from '../App.js'

describe('App', () => {
  it('should render without throwing an error', async () => {
    const { asFragment } = render(<App/>)

    await waitFor(() => asFragment())
  })
})
