import $$GitHubLogo from '@/assets/images/github-logo.svg'
import { useChangeLocale, useI18n } from '@lib/i18n'
import { type HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLElement>

export function Footer({ ...props }: Readonly<Props>) {
  const { t } = useI18n()
  const changeLocale = useChangeLocale()

  return (
    <footer {...props}>
      <nav>
        <a
          aria-label='GitHub'
          className='icon'
          href='https://github.com/andrewscwei/react-static-starter-kit'
        >
          <img alt='GitHub' src={$$GitHubLogo}/>
        </a>
      </nav>
      <button
        aria-label={t('en')}
        className='icon'
        style={{ background: 'var(--color-dark-grey)' }}
        onClick={() => changeLocale('en')}
      >
        {t('en')}
      </button>
      <button
        aria-label={t('ja')}
        className='icon'
        style={{ background: 'var(--color-dark-grey)', marginLeft: '1rem' }}
        onClick={() => changeLocale('ja')}
      >
        {t('ja')}
      </button>
    </footer>
  )
}
