import { useI18n } from '@lib/i18n'

import { BUILD_NUMBER, VERSION } from '@/app.config.js'
import { ReactLogo } from '@/ui/components/ReactLogo.js'
import { Page } from '@/ui/containers/Page.js'

export function Component() {
  const { t } = useI18n()

  return (
    <Page metadata={{ title: t('window-title-home') }}>
      <main>
        <div className='content'>
          <ReactLogo/>
          <div>
            <h1>{t('hello')}</h1>
            <code style={{ marginBottom: '1rem' }}>{`v${VERSION}+build.${BUILD_NUMBER.slice(0, 7)}`}</code>
            <span>{t('description')}</span>
          </div>
        </div>
      </main>
    </Page>
  )
}
