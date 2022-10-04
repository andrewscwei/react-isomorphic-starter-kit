import FetchUseCase from './FetchUseCase'

type Quote = {
  author: string
  text: string
}

export default class GetQuote extends FetchUseCase<never, Quote> {
  get ttl(): number { return 0 }

  getEndpoint() { return 'https://type.fit/api/quotes' }

  transformResult(payload: any): Quote {
    const { author, text } = payload[Math.floor(Math.random() * payload.length)]

    return {
      author,
      text,
    }
  }
}
