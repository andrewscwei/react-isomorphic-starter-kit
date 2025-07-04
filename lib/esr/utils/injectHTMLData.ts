import { type HTMLData } from '../types/HTMLData.js'

export function injectHTMLData(template: string, data: HTMLData): string {
  let output = template

  Object.entries(data).forEach(([key, value]) => {
    output = injectString(output, key, value)
    output = injectConditional(output, key, value)
  })

  output = dejectExtraneousConditionals(output)

  return output
}

function injectString(input: string, key: string, value: any) {
  if (typeof value !== 'string') return input

  return input.replace(RegExp(`<!--\\s*(${key})\\s*-->`, 'gi'), value)
}

function injectConditional(input: string, key: string, value: any) {
  if (!value) return input

  let output = input

  output = output.replace(RegExp(`<!--\\s*IF !${key}\\s*-->(.*?)<!--\\s*ENDIF !${key}\\s*-->`, 'gis'), '')
  output = output.replace(RegExp(`<!--\\s*IF ${key}\\s*-->`, 'gis'), '')
  output = output.replace(RegExp(`<!--\\s*ENDIF ${key}\\s*-->`, 'gis'), '')

  return output
}

function dejectExtraneousConditionals(input: string) {
  let output = input

  output = output.replace(/<!--\s*IF ([0-9a-z_-]+)\s*-->(.*?)<!--\s*ENDIF \1\s*-->/gis, '')
  output = output.replace(/<!--\s*IF !([0-9a-z_-]+)\s*-->/gis, '')
  output = output.replace(/<!--\s*ENDIF !([0-9a-z_-]+)\s*-->/gis, '')

  return output
}
