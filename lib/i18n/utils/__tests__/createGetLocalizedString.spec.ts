import { afterEach, describe, expect, it, vi } from 'vitest'

import { type I18nConfig } from '../../types/I18nConfig.js'
import { createGetLocalizedString } from '../createGetLocalizedString.js'

const CONFIG: I18nConfig = {
  defaultLocale: 'en',
  localeChangeStrategy: 'action',
  supportedLocales: ['en', 'en-GB', 'ja', 'pt', 'zh-Hant', 'nl'],
  translations: {
    'en': { color: 'color', greeting: 'Hello %s', only: 'only in en' },
    'en-GB': { color: 'colour' },
    'ja': {},
    'pt-PT': { color: 'cor' },
    'zh-Hans': { color: '颜色', only: '仅简体' },
    'zh-Hant': { color: '顏色' },
  },
}

describe('createGetLocalizedString', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should format a localized string', () => {
    expect(createGetLocalizedString('en', CONFIG)('greeting', 'Ann')).toEqual('Hello Ann')
  })

  it('should use the best matching translations', () => {
    expect(createGetLocalizedString('pt', CONFIG)('color')).toEqual('cor')
    expect(createGetLocalizedString('zh-TW', CONFIG)('color')).toEqual('顏色')
  })

  it('should fall back to the next best matching translations', () => {
    expect(createGetLocalizedString('en-GB', CONFIG)('color')).toEqual('colour')
    expect(createGetLocalizedString('en-GB', CONFIG)('only')).toEqual('only in en')
    expect(createGetLocalizedString('zh-Hant', CONFIG)('only')).toEqual('仅简体')
  })

  it('should fall back to the default locale with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const t = createGetLocalizedString('ja', CONFIG)

    expect(t('only')).toEqual('only in en')
    expect(t('only')).toEqual('only in en')
    expect(warn).toHaveBeenCalledOnce()
  })

  it('should fall back to the default locale when no translations match', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(createGetLocalizedString('nl', CONFIG)('color')).toEqual('color')
    expect(warn).toHaveBeenCalledOnce()
  })

  it('should warn once across instances', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    createGetLocalizedString('en', CONFIG)('shared.missing')
    createGetLocalizedString('en', CONFIG)('shared.missing')

    expect(warn).toHaveBeenCalledOnce()
  })

  it('should return the key path for missing keys with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const t = createGetLocalizedString('en', CONFIG)

    expect(t('missing')).toEqual('missing')
    expect(t('greeting.nested')).toEqual('greeting.nested')
    expect(warn).toHaveBeenCalledTimes(2)
  })
})
