import { describe, expect, it } from 'vitest'

import { type ResolveLocaleOptions } from '../../types/ResolveLocaleOptions.js'
import { resolveLocaleFromURL } from '../resolveLocaleFromURL.js'

const OPTIONS: ResolveLocaleOptions = {
  defaultLocale: 'en',
  localeChangeStrategy: 'path',
  supportedLocales: ['en', 'en-GB', 'ja'],
}

describe('resolveLocaleFromURL', () => {
  it('should resolve a supported locale from the path', () => {
    expect(resolveLocaleFromURL('/en/scan', OPTIONS)).toEqual('en')
    expect(resolveLocaleFromURL('/ja/scan', OPTIONS)).toEqual('ja')
    expect(resolveLocaleFromURL('/en-GB/scan', OPTIONS)).toEqual('en-GB')
  })

  it('should match the supported locales case-insensitively', () => {
    expect(resolveLocaleFromURL('/EN-gb/scan', OPTIONS)).toEqual('en-GB')
    expect(resolveLocaleFromURL('/scan?locale=JA', { ...OPTIONS, localeChangeStrategy: 'query' })).toEqual('ja')
  })

  it('should ignore relative paths', () => {
    expect(resolveLocaleFromURL('ja/scan', OPTIONS)).toBeUndefined()
  })

  it('should resolve a supported locale from the query', () => {
    expect(resolveLocaleFromURL('/scan?locale=ja', { ...OPTIONS, localeChangeStrategy: 'query' })).toEqual('ja')
    expect(resolveLocaleFromURL('/ja/scan', { ...OPTIONS, localeChangeStrategy: 'query' })).toBeUndefined()
  })

  it('should return nothing for URLs without a supported locale', () => {
    expect(resolveLocaleFromURL('/scan', OPTIONS)).toBeUndefined()
    expect(resolveLocaleFromURL('/nl/scan', OPTIONS)).toBeUndefined()
    expect(resolveLocaleFromURL('/en-US/scan', OPTIONS)).toBeUndefined()
  })

  it('should ignore the URL with the action strategy', () => {
    expect(resolveLocaleFromURL('/ja/scan', { ...OPTIONS, localeChangeStrategy: 'action' })).toBeUndefined()
  })
})
