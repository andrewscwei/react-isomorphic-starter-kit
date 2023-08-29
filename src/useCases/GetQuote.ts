import { FetchUseCase } from '../../lib/interactors'

export type Quote = {
  author: string
  text: string
}

export class GetQuote extends FetchUseCase<never, Quote> {
  getEndpoint() { return 'https://type.fit/api/quotes' }

  transformResult(payload: any): Quote {
    const { author, text } = payload[Math.floor(Math.random() * payload.length)]

    return {
      author,
      text,
    }
  }
}
