import get from 'get-value'
import he from 'he'

import { type HTMLData } from '../types/HTMLData.js'

export function renderTemplate(template: string, data: HTMLData): string {
  let output = template

  while (true) {
    const newOutput = replaceConditionals(output, data)
    if (newOutput === output) break
    output = newOutput
  }

  output = replaceVariables(output, data)

  return output
}

function replaceVariables(input: string, data: HTMLData) {
  let output = input

  const re = /<!--\s*([a-z0-9_.!|& ]+)\s*-->/gis
  const matches = Array.from(output.matchAll(re))

  let offset = 0

  matches.forEach(match => {
    const matched = match[0]
    const expression = match[1]
    const value = evaluateExpression(expression, data, false) ?? ''
    const length = matched.length

    output = output.substring(0, match.index + offset) + value + output.substring(match.index + length + offset)
    offset += value.length - length
  })

  return output
}

function replaceConditionals(input: string, data: HTMLData) {
  let output = input

  const re = /(<!--\s*IF ([a-z0-9_.!|& ]+)\s*-->).*?(<!--\s*ENDIF \2\s*-->)/gis
  const matches = Array.from(output.matchAll(re))

  let offset = 0

  matches.forEach(match => {
    const matched = match[0]
    const openTag = match[1]
    const expression = match[2]
    const closeTag = match[3]
    const condition = evaluateExpression(expression, data, true)
    const breakpoints = [
      match.index,
      match.index + openTag.length,
      match.index + matched.length - closeTag.length,
      match.index + matched.length,
    ].map(i => i + offset)

    let newOutput: string

    if (condition) {
      newOutput = output.substring(0, breakpoints[0]) + output.substring(breakpoints[1], breakpoints[2]) + output.substring(breakpoints[3])
    } else {
      newOutput = output.substring(0, breakpoints[0]) + output.substring(breakpoints[3])
    }

    offset += newOutput.length - output.length
    output = newOutput
  })

  return output
}

function getValue(key: string, data: HTMLData, asCondition: boolean) {
  const isNot = key.startsWith('!')
  const value = get(data, isNot ? key.substring(1) : key) ?? ''

  if (asCondition) {
    return isNot ? !value : !!value
  } else {
    const out = isNot ? !value : value

    return key === 'localData' ? out : he.encode(out)
  }
}

function evaluateExpression(expression: string, data: HTMLData, asCondition: boolean) {
  const expr = expression.trim()

  if (expr === '') {
    return undefined
  }

  const orParts = expr.split(/\s*\|\|\s*/)

  let lastAndValue: any

  for (const orPart of orParts) {
    const andParts = orPart.split(/\s*&&\s*/).map(k => k.trim())

    let andValue = getValue(andParts[0], data, asCondition)

    for (let i = 1; i < andParts.length; i++) {
      if (!andValue) {
        break
      }

      andValue = getValue(andParts[i], data, asCondition)
    }

    lastAndValue = andValue

    if (andValue) {
      return andValue
    }
  }

  return lastAndValue
}
