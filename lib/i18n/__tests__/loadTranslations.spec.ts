import { describe, expect, it } from 'vitest'

import { loadTranslations } from '../loadTranslations.js'

describe('loadTranslations', () => {
  it('should name translations after the files and directories in the directory', () => {
    const files = {
      './en.json': { default: { a: 'a' } },
      './en/common.json': { default: { b: 'b' } },
      './zh-Hant.json': { default: { a: '甲' } },
    }

    expect(loadTranslations([files])).toEqual({
      'en': { a: 'a', common: { b: 'b' } },
      'zh-Hant': { a: '甲' },
    })
  })

  it('should merge translations from multiple directories', () => {
    expect(loadTranslations([
      { './en.json': { default: { a: 'a', b: 'b' } } },
      { './en.json': { default: { b: 'B' } } },
    ])).toEqual({ en: { a: 'a', b: 'B' } })
  })

  it('should ignore unsafe keys', () => {
    const translations = loadTranslations([{ './en.json': { default: JSON.parse('{"a": "a", "__proto__": { "polluted": true }, "constructor": "x"}') } }])

    expect(translations).toEqual({ en: { a: 'a' } })
    expect(({} as any).polluted).toBeUndefined()
    expect(Object.getPrototypeOf(translations.en)).toBe(Object.prototype)
  })

  it('should reject paths that are not relative to the translations directory', () => {
    expect(() => loadTranslations([{ '../locales/en.json': { default: {} } }])).toThrow('must be relative')
    expect(() => loadTranslations([{ '/locales/en.json': { default: {} } }])).toThrow('must be relative')
  })
})
