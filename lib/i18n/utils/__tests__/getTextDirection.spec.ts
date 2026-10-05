import { describe, expect, it } from 'vitest'

import { getTextDirection } from '../getTextDirection.js'

describe('getTextDirection', () => {
  it('should return rtl for right-to-left locales', () => {
    expect(getTextDirection('ar')).toEqual('rtl')
    expect(getTextDirection('he-IL')).toEqual('rtl')
    expect(getTextDirection('fa')).toEqual('rtl')
    expect(getTextDirection('az-Arab')).toEqual('rtl')
  })

  it('should return ltr for other and malformed locales', () => {
    expect(getTextDirection('en')).toEqual('ltr')
    expect(getTextDirection('zh-Hant')).toEqual('ltr')
    expect(getTextDirection('en_GB')).toEqual('ltr')
  })
})
