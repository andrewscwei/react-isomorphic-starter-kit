import { describe, expect, it } from 'vitest'

import { isLocale } from '../isLocale.js'

describe('isLocale', () => {
  it('should accept canonical tags', () => {
    expect(isLocale('en')).toBe(true)
    expect(isLocale('zh-Hant-TW')).toBe(true)
  })

  it('should reject malformed and non-canonical tags', () => {
    expect(isLocale('')).toBe(false)
    expect(isLocale('en_GB')).toBe(false)
    expect(isLocale('zh-hant')).toBe(false)
  })
})
