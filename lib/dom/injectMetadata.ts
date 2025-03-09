import { type Metadata } from './Metadata.js'

export function injectMetadata(template: string, metadata: Metadata, replacements: { regex: RegExp; replaceValue: string }[] = []): string {
  const injected = template
    .replace(/<!-- BASE_TITLE -->/g, metadata.baseTitle ?? '')
    .replace(/<!-- DESCRIPTION -->/g, metadata.description ?? '')
    .replace(/<!-- LOCALE -->/g, metadata.locale ?? '')
    .replace(/<!-- THEME_COLOR -->/g, metadata.themeColor ?? '')
    .replace(/<!-- TITLE -->/g, metadata.title ?? '')
    .replace(/<!-- CANONICAL_URL -->/g, metadata.canonicalURL ?? '')

  return replacements.reduce((acc, { regex, replaceValue }) => acc.replace(regex, replaceValue), injected)
}
