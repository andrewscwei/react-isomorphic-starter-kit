import { describe, expect, it } from 'vitest'

import { negotiateLocale } from '../negotiateLocale.js'

describe('negotiateLocale', () => {
  it('should match an available locale exactly', () => {
    expect(negotiateLocale(['ja'], ['en', 'ja'])).toEqual('ja')
    expect(negotiateLocale(['pt-PT'], ['pt-BR', 'pt-PT'])).toEqual('pt-PT')
  })

  it('should accept a single preferred locale', () => {
    expect(negotiateLocale('ja', ['en', 'ja'])).toEqual('ja')
    expect(negotiateLocale('nl', ['en', 'ja'])).toBeUndefined()
  })

  it('should honour the preference order', () => {
    expect(negotiateLocale(['ja', 'de'], ['en', 'de', 'ja'])).toEqual('ja')
    expect(negotiateLocale(['de', 'ja'], ['en', 'de', 'ja'])).toEqual('de')
  })

  it('should narrow a regional tag to its available language subtag', () => {
    expect(negotiateLocale(['de-DE', 'de'], ['en', 'de'])).toEqual('de')
    expect(negotiateLocale(['fr-CA'], ['fr', 'fr-FR'])).toEqual('fr')
  })

  it('should match a regional tag to an available script tag', () => {
    expect(negotiateLocale(['zh-TW'], ['zh-Hans', 'zh-Hant'])).toEqual('zh-Hant')
    expect(negotiateLocale(['zh-Hant-TW'], ['zh-Hans', 'zh-Hant'])).toEqual('zh-Hant')
    expect(negotiateLocale(['zh-CN'], ['zh-Hant', 'zh-Hans'])).toEqual('zh-Hans')
  })

  it('should prefer the same script over another tag of the same language', () => {
    expect(negotiateLocale(['zh-TW'], ['zh-CN', 'zh-Hant'])).toEqual('zh-Hant')
    expect(negotiateLocale(['zh'], ['zh-Hant', 'zh-Hans'])).toEqual('zh-Hans')
  })

  it('should fall back to another tag of the same language', () => {
    expect(negotiateLocale(['zh'], ['en', 'zh-TW'])).toEqual('zh-TW')
    expect(negotiateLocale(['zh-TW'], ['en', 'zh-CN'])).toEqual('zh-CN')
    expect(negotiateLocale(['pt-BR'], ['en', 'pt-PT'])).toEqual('pt-PT')
    expect(negotiateLocale(['pt'], ['en', 'pt-PT'])).toEqual('pt-PT')
  })

  it('should prefer a fallback for a preferred locale over a less preferred match', () => {
    expect(negotiateLocale(['pt-BR', 'en'], ['en', 'pt-PT'])).toEqual('pt-PT')
    expect(negotiateLocale(['zh-TW', 'en'], ['en', 'zh-CN'])).toEqual('zh-CN')
  })

  it('should match case-insensitively and preserve the available casing', () => {
    expect(negotiateLocale(['zh-tw'], ['en', 'zh-TW'])).toEqual('zh-TW')
    expect(negotiateLocale(['ZH-TW'], ['en', 'zh-TW'])).toEqual('zh-TW')
  })

  it('should skip locales that are not available', () => {
    expect(negotiateLocale(['de-DE', 'de', 'en'], ['en', 'ja'])).toEqual('en')
    expect(negotiateLocale(['de-DE', 'de'], ['en', 'ja'])).toBeUndefined()
    expect(negotiateLocale(['nl-NL', 'nl'], ['en', 'ja'])).toBeUndefined()
  })

  it('should tolerate malformed tags', () => {
    expect(negotiateLocale(['en_US', 'ja'], ['en', 'ja'])).toEqual('ja')
  })

  it('should return nothing without preferred or available locales', () => {
    expect(negotiateLocale([], ['en', 'ja'])).toBeUndefined()
    expect(negotiateLocale(['ja'], [])).toBeUndefined()
  })
})
