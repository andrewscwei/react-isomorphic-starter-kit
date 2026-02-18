import { useChangeLocale, useI18n } from '@lib/i18n'
import { type HTMLAttributes } from 'react'

import $$GitHubLogo from '@/assets/images/github-logo.svg'

type Props = HTMLAttributes<HTMLElement>

export function Footer({ ...props }: Readonly<Props>) {
  const { t } = useI18n()
  const changeLocale = useChangeLocale()

  return (
    <footer {...props}>
      <nav>
        <a
          className='icon'
          aria-label='GitHub'
          href='https://github.com/andrewscwei/react-static-starter-kit'
        >
          <img alt='GitHub' src={$$GitHubLogo}/>
        </a>
      </nav>
      <button
        className='icon'
        style={{ background: 'var(--color-dark-grey)' }}
        aria-label={t('en')}
        onClick={() => changeLocale('en')}
      >
        {t('en')}
      </button>
      <button
        className='icon'
        style={{ background: 'var(--color-dark-grey)', marginLeft: '1rem' }}
        aria-label={t('ja')}
        onClick={() => changeLocale('ja')}
      >
        {t('ja')}
      </button>
    </footer>
  )
}
