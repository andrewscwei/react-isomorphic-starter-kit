import get from 'get-value'
import { type HTMLData } from '../types/HTMLData.js'

export function injectHTMLData(template: string, data: HTMLData): string {
  let output = template

  output = replaceConditionals(output, data)
  output = replaceVariables(output, data)

  return output
}

function replaceVariables(input: string, data: HTMLData) {
  let output = input

  const re = /<!--\s*([a-z0-9_.!]+)\s*-->/gis
  const matches = Array.from(output.matchAll(re))

  let offset = 0

  matches.forEach(match => {
    const matched = match[0]
    const key = match[1]
    const value = get(data, key) ?? ''
    const length = matched.length
    output = output.substring(0, match.index + offset) + value + output.substring(match.index + length + offset)
    offset += value.length - length
  })

  return output
}

function replaceConditionals(input: string, data: HTMLData) {
  let output = input

  const re = /(<!--\s*IF ([a-z0-9_.!]+)\s*-->).*?(<!--\s*ENDIF \2\s*-->)/gis
  const matches = Array.from(output.matchAll(re))

  let offset = 0

  matches.forEach(match => {
    const matched = match[0]
    const openTag = match[1]
    const key = match[2]
    const closeTag = match[3]
    const isNegative = key.startsWith('!')
    const value = get(data, isNegative ? key.substring(1) : key) ?? ''
    const condition = isNegative ? !value : !!value
    const breakpoints = [
      match.index,
      match.index + openTag.length,
      match.index + matched.length - closeTag.length,
      match.index + matched.length,
    ].map(i => i + offset)

    let newOutput: string

    if (condition) {
      newOutput = output.substring(0, breakpoints[0]) + output.substring(breakpoints[1], breakpoints[2]) + output.substring(breakpoints[3])
    }
    else {
      newOutput = output.substring(0, breakpoints[0]) + output.substring(breakpoints[3])
    }

    offset += newOutput.length - output.length
    output = newOutput
  })

  return output
}
