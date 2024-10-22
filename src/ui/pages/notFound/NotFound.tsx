import { useMeta } from '@lib/dom/index.js'
import { useLocalizedString } from '@lib/i18n/index.js'

export function Component() {
  const ltxt = useLocalizedString()

  useMeta({
    title: ltxt('window-title-not-found'),
  })

  return (
    <main>
      <h1>{ltxt('not-found-title')}</h1>
    </main>
  )
}
