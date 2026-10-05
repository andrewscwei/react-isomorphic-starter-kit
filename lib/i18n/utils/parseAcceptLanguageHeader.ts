/**
 * Parses an `Accept-Language` header into lowercased tags ordered by
 * preference, dropping wildcards and entries explicitly refused with `q=0`.
 *
 * @param header The raw `Accept-Language` header.
 *
 * @returns The requested tags, most preferred first.
 */
export function parseAcceptLanguageHeader(header: string): string[] {
  const tags: { q: number; tag: string }[] = []

  for (const part of header.split(',')) {
    const [value, ...params] = part.trim().split(';')
    const tag = value?.trim().toLowerCase() ?? ''

    if (!tag || tag === '*') continue

    const qParam = params.find(p => p.trim().startsWith('q='))
    const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1

    if (!Number.isFinite(q) || q <= 0) continue

    tags.push({ q, tag })
  }

  return tags.sort((a, b) => b.q - a.q).map(({ tag }) => tag)
}
