import { describe, expect, it } from 'vitest'

import { parseAcceptLanguageHeader } from '../parseAcceptLanguageHeader.js'

describe('parseAcceptLanguageHeader', () => {
  it('should order tags by q-weight', () => {
    expect(parseAcceptLanguageHeader('de;q=0.5,ja;q=0.9')).toEqual(['ja', 'de'])
    expect(parseAcceptLanguageHeader('de,ja;q=0.8')).toEqual(['de', 'ja'])
  })

  it('should lowercase tags', () => {
    expect(parseAcceptLanguageHeader('zh-TW,en-US;q=0.5')).toEqual(['zh-tw', 'en-us'])
  })

  it('should ignore wildcards and refused languages', () => {
    expect(parseAcceptLanguageHeader('*')).toEqual([])
    expect(parseAcceptLanguageHeader('ja;q=0')).toEqual([])
    expect(parseAcceptLanguageHeader('ja;q=0,en')).toEqual(['en'])
  })

  it('should return nothing for an empty header', () => {
    expect(parseAcceptLanguageHeader('')).toEqual([])
  })
})
