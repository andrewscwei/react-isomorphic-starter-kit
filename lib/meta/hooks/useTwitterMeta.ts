import { type DependencyList, useEffect } from 'react'

import { type Metadata } from '../types/Metadata.js'
import { updateElementAttributes } from '../utils/updateElementAttributes.js'

type Params = Metadata['twitter']

type Options = {
  auto?: boolean
  isEnabled?: boolean
}

export function useTwitterMeta(
  params: Params = {},
  { auto = true, isEnabled = true }: Options = {},
  deps: DependencyList = [],
) {
  const card = isEnabled ? params.card ?? (auto ? 'summary_large_image' : undefined) : undefined
  const description = isEnabled ? params.description : undefined
  const image = isEnabled ? params.image : undefined
  const title = isEnabled ? params.title : undefined

  useEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'twitter:description' },
    { name: 'content', value: description },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [description, ...deps])

  useEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'twitter:image' },
    { name: 'content', value: image },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [image, ...deps])

  useEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'twitter:title' },
    { name: 'content', value: title },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [title, ...deps])

  useEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'twitter:card' },
    { name: 'content', value: card },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [card, ...deps])
}
