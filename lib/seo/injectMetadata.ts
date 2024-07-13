import { type Metadata } from './Metadata'

export function injectMetadata(template: string, metadata: Metadata) {
  return template
    .replace(/<!-- BASE_TITLE -->/g, metadata.baseTitle ?? '')
    .replace(/<!-- DESCRIPTION -->/g, metadata.description ?? '')
    .replace(/<!-- LOCALE -->/g, metadata.locale ?? '')
    .replace(/<!-- MASK_ICON_COLOR -->/g, metadata.maskIconColor ?? '')
    .replace(/<!-- THEME_COLOR -->/g, metadata.themeColor ?? '')
    .replace(/<!-- TITLE -->/g, metadata.title ?? '')
    .replace(/<!-- URL -->/g, metadata.url ?? '')
    .replace(/<!-- PUBLIC_URL -->/g, metadata.publicURL ?? '/')
}
