import { type DependencyList } from 'react'
import type { Metadata } from '../types/Metadata.js'
import { updateElementAttributes } from '../utils/updateElementAttributes.js'
import { useDOMEffect } from './useDOMEffect.js'

type Params = Metadata['apple']

type Options = {
  auto?: boolean
  isEnabled?: boolean
}

export function useAppleMeta(
  params: Params = {},
  { auto = true, isEnabled = true }: Options = {},
  deps: DependencyList = [],
) {
  const title = isEnabled ? params.title : undefined
  const statusBarStyle = isEnabled ? params.statusBarStyle ?? (auto ? 'default' : undefined) : undefined
  const webAppCapable = isEnabled ? 'yes' : undefined
  const icon = isEnabled ? '/app-icon-180.png' : undefined

  useDOMEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'apple-mobile-web-app-capable' },
    { name: 'content', value: webAppCapable },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [webAppCapable, ...deps])

  useDOMEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'apple-mobile-web-app-status-bar-style' },
    { name: 'content', value: statusBarStyle },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [statusBarStyle, ...deps])

  useDOMEffect(() => updateElementAttributes('meta', [
    { key: true, name: 'name', value: 'apple-mobile-web-app-title' },
    { name: 'content', value: title },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [title, ...deps])

  useDOMEffect(() => updateElementAttributes('link', [
    { key: true, name: 'rel', value: 'apple-touch-icon' },
    { name: 'type', value: 'image/png' },
    { name: 'href', value: icon },
    { name: 'sizes', value: '180x180' },
  ], {
    autoCreate: auto,
    autoDestroy: auto,
  }), [icon, ...deps])
}
