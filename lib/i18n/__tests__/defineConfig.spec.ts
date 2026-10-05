import { describe, expect, it } from 'vitest'

import { defineConfig } from '../defineConfig.js'

describe('defineConfig', () => {
  it('should accept plain translations', () => {
    const translations = { 'en': { a: 'a' }, 'en-GB': {} }

    expect(defineConfig({ translations }).translations).toEqual(translations)
  })

  it('should load translations from glob imports', () => {
    const sources = [{ './en.json': { default: { a: 'a' } }, './ja.json': { default: { a: 'あ' } } }]

    expect(defineConfig({ sources }).translations).toEqual({ en: { a: 'a' }, ja: { a: 'あ' } })
  })

  it('should default the supported locales to the default locale', () => {
    expect(defineConfig({ defaultLocale: 'ja' }).supportedLocales).toEqual(['ja'])
  })

  it('should reject malformed or non-canonical locales', () => {
    expect(() => defineConfig({ translations: { 'en': {}, 'en-gb': {} } })).toThrow()
    expect(() => defineConfig({ supportedLocales: ['en', 'zh-hant'] })).toThrow()
    expect(() => defineConfig({ defaultLocale: 'EN' })).toThrow()
  })

  it('should reject supported locales without the default locale', () => {
    expect(() => defineConfig({ defaultLocale: 'en', supportedLocales: ['ja'] })).toThrow('default locale "en"')
  })
})
