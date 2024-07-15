import { useEffect, type DependencyList } from 'react'
import { updateElementAttributes } from './updateElementAttributes.js'

type Params = {
  card?: 'summary_large_image' | 'summary' | 'app' | 'player'
  description?: string
  image?: string
  title?: string
}

type Options = {
  auto?: boolean
}

export function useTwitterMeta(params: Params = {}, { auto = true }: Options = {}, deps?: DependencyList) {
  const card = params.card ?? (auto ? 'summary_large_image' : undefined)
  const description = params.description
  const image = params.image
  const title = params.title

  const updateOptions: Parameters<typeof updateElementAttributes>[2] = { autoCreate: auto, parent: typeof window !== 'undefined' ? window.document.head : undefined }
  const getTagName = (value?: string): Parameters<typeof updateElementAttributes>[0] => value === undefined ? undefined : 'meta'

  useEffect(() => updateElementAttributes(getTagName(description), [
    { key: true, name: 'name', value: 'twitter:description' },
    { name: 'content', value: description },
  ], updateOptions), [description, ...deps ?? []])

  useEffect(() => updateElementAttributes(getTagName(image), [
    { key: true, name: 'name', value: 'twitter:image' },
    { name: 'content', value: image },
  ], updateOptions), [image, ...deps ?? []])

  useEffect(() => updateElementAttributes(getTagName(title), [
    { key: true, name: 'name', value: 'twitter:title' },
    { name: 'content', value: title },
  ], updateOptions), [title, ...deps ?? []])

  useEffect(() => updateElementAttributes(getTagName(card), [
    { key: true, name: 'name', value: 'twitter:card' },
    { name: 'content', value: card },
  ], updateOptions), [card, ...deps ?? []])
}
