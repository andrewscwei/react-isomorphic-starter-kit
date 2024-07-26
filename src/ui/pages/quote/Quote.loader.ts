import { type LoaderFunctionArgs } from 'react-router'
import { getRandomQutoe } from '../../../services/quotes.js'

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  return getRandomQutoe()
}
