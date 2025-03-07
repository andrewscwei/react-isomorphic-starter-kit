import { type DependencyList } from 'react'
import { type Metadata } from './Metadata.js'
import { updateElementAttributes } from './updateElementAttributes.js'
import { useDOMEffect } from './useDOMEffect.js'

type Params = Metadata['openGraph']

type Options = {
  auto?: boolean
  isEnabled?: boolean
}

export function useOpenGraphMeta(
  params: Params = {},
  { auto = true, isEnabled = true }: Options = {},
  deps: DependencyList = [],
) {
  const description = isEnabled ? params.description : undefined
  const image = isEnabled ? params.image : undefined
  const imageAlt = isEnabled ? params.imageAlt ?? (auto ? params.description : undefined) : undefined
  const siteName = isEnabled ? params.siteName : undefined
  const title = isEnabled ? params.title : undefined
  const type = isEnabled ? params.type ?? (auto ? 'website' : undefined) : undefined
  const url = isEnabled ? params.url : undefined

  useDOMEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'property', value: 'og:description' },
    { name: 'content', value: description },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [description, ...deps])

  useDOMEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'property', value: 'og:image' },
    { name: 'content', value: image },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [image, ...deps])

  useDOMEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'property', value: 'og:image:alt' },
    { name: 'content', value: imageAlt },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [imageAlt, ...deps])

  useDOMEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'property', value: 'og:site_name' },
    { name: 'content', value: siteName },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [siteName, ...deps])

  useDOMEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'property', value: 'og:title' },
    { name: 'content', value: title },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [title, ...deps])

  useDOMEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'property', value: 'og:type' },
    { name: 'content', value: type },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [type, ...deps])

  useDOMEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'property', value: 'og:url' },
    { name: 'content', value: url },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [url, ...deps])
}
