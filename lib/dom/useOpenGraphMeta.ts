import { useEffect, type DependencyList } from 'react'
import { type Metadata } from './Metadata.js'
import { updateElementAttributes } from './updateElementAttributes.js'

type Params = Metadata['openGraph']

type Options = {
  auto?: boolean
}

export function useOpenGraphMeta(params: Params = {}, { auto = true }: Options = {}, deps?: DependencyList) {
  const description = params.description
  const image = params.image
  const imageAlt = params.imageAlt ?? (auto ? params.description : undefined)
  const siteName = params.siteName
  const title = params.title
  const type = params.type ?? (auto ? 'website' : undefined)
  const url = params.url ?? ((auto && typeof window !== 'undefined') ? window.location.href : undefined)

  const updateOptions: Parameters<typeof updateElementAttributes>[2] = { autoCreate: auto, parent: typeof window !== 'undefined' ? window.document.head : undefined }
  const getTagName = (value?: string): Parameters<typeof updateElementAttributes>[0] => value === undefined ? undefined : 'meta'

  useEffect(() => updateElementAttributes(getTagName(description), [
    { key: true, name: 'property', value: 'og:description' },
    { name: 'content', value: description },
  ], updateOptions), [description, ...deps ?? []])

  useEffect(() => updateElementAttributes(getTagName(image), [
    { key: true, name: 'property', value: 'og:image' },
    { name: 'content', value: image },
  ], updateOptions), [image, ...deps ?? []])

  useEffect(() => updateElementAttributes(getTagName(imageAlt), [
    { key: true, name: 'property', value: 'og:image:alt' },
    { name: 'content', value: imageAlt },
  ], updateOptions), [imageAlt, ...deps ?? []])

  useEffect(() => updateElementAttributes(getTagName(siteName), [
    { key: true, name: 'property', value: 'og:site_name' },
    { name: 'content', value: siteName },
  ], updateOptions), [siteName, ...deps ?? []])

  useEffect(() => updateElementAttributes(getTagName(title), [
    { key: true, name: 'property', value: 'og:title' },
    { name: 'content', value: title },
  ], updateOptions), [title, ...deps ?? []])

  useEffect(() => updateElementAttributes(getTagName(type), [
    { key: true, name: 'property', value: 'og:type' },
    { name: 'content', value: type },
  ], updateOptions), [type, ...deps ?? []])

  useEffect(() => updateElementAttributes(getTagName(url), [
    { key: true, name: 'property', value: 'og:url' },
    { name: 'content', value: url },
  ], updateOptions), [url, ...deps ?? []])
}
