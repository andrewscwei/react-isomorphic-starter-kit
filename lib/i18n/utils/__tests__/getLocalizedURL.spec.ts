import { describe, expect, it } from 'vitest'

import { type ResolveLocaleOptions } from '../../types/ResolveLocaleOptions.js'
import { getLocalizedURL } from '../getLocalizedURL.js'

const OPTIONS: Omit<ResolveLocaleOptions, 'localeChangeStrategy'> = { defaultLocale: 'en', supportedLocales: ['en', 'fr', 'ja'] }

describe('getLocalizedURL', () => {
  it('should replace the locale in the path', () => {
    expect(getLocalizedURL('/fr/scan', 'ja', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('/ja/scan')
    expect(getLocalizedURL('/scan', 'ja', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('/ja/scan')
    expect(getLocalizedURL('/fr/scan', 'en', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('/scan')
    expect(getLocalizedURL('https://example.com/fr/scan?a=1#b', 'ja', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('https://example.com/ja/scan?a=1#b')
    expect(getLocalizedURL('/', 'ja', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('/ja')
  })

  it('should replace the locale in the query', () => {
    expect(getLocalizedURL('/scan?locale=fr', 'ja', { ...OPTIONS, localeChangeStrategy: 'query' })).toEqual('/scan?locale=ja')
    expect(getLocalizedURL('/scan?locale=fr', 'en', { ...OPTIONS, localeChangeStrategy: 'query' })).toEqual('/scan')
  })

  it('should preserve the form of the URL', () => {
    expect(getLocalizedURL('/scan/', 'ja', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('/ja/scan/')
    expect(getLocalizedURL('/fr/scan/', 'en', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('/scan/')
    expect(getLocalizedURL('/fr', 'en', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('/')
    expect(getLocalizedURL('https://user:pw@example.com/scan', 'ja', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('https://user:pw@example.com/ja/scan')
    expect(getLocalizedURL('http://[::1]:3000/fr/scan', 'ja', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('http://[::1]:3000/ja/scan')
    expect(getLocalizedURL('https://example.com', 'ja', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('https://example.com/ja')
  })

  it('should leave relative URLs unchanged with the path strategy', () => {
    expect(getLocalizedURL('scan/get', 'ja', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('scan/get')
    expect(getLocalizedURL('?tab=1', 'ja', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('?tab=1')
    expect(getLocalizedURL('#top', 'ja', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('#top')
  })

  it('should localize relative URLs with the query strategy', () => {
    expect(getLocalizedURL('?tab=1', 'ja', { ...OPTIONS, localeChangeStrategy: 'query' })).toEqual('?tab=1&locale=ja')
    expect(getLocalizedURL('scan#top', 'ja', { ...OPTIONS, localeChangeStrategy: 'query' })).toEqual('scan?locale=ja#top')
  })

  it('should leave the URL unchanged with the action strategy', () => {
    expect(getLocalizedURL('/fr/scan', 'ja', { ...OPTIONS, localeChangeStrategy: 'action' })).toEqual('/fr/scan')
  })

  it('should negotiate the target to a supported locale', () => {
    expect(getLocalizedURL('/scan', 'ja-JP', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('/ja/scan')
    expect(getLocalizedURL('/fr/scan', 'en-GB', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('/scan')
  })

  it('should fall back to the default for unsupported locales', () => {
    expect(getLocalizedURL('/fr/scan', 'nl', { ...OPTIONS, localeChangeStrategy: 'path' })).toEqual('/scan')
  })
})
