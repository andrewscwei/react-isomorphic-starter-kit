import { useChangeLocale, useLocalizedString } from '@lib/i18n'
import { type HTMLAttributes } from 'react'
import $$GitHubLogo from '../assets/images/github-logo.svg'

type Props = HTMLAttributes<HTMLElement>

export function Footer({ ...props }: Readonly<Props>) {
  const ltxt = useLocalizedString()
  const changeLocale = useChangeLocale()

  return (
    <footer {...props}>
      <nav>
        <a
          aria-label='GitHub'
          className='icon'
          href='https://github.com/andrewscwei/react-isomorphic-starter-kit'
        >
          <img alt='GitHub' src={$$GitHubLogo}/>
        </a>
      </nav>
      <button
        aria-label={ltxt('en')}
        className='icon'
        style={{ background: 'var(--color-dark-grey)' }}
        onClick={() => changeLocale('en')}
      >
        {ltxt('en')}
      </button>
      <button
        aria-label={ltxt('ja')}
        className='icon'
        style={{ background: 'var(--color-dark-grey)', marginLeft: '1rem' }}
        onClick={() => changeLocale('ja')}
      >
        {ltxt('ja')}
      </button>
    </footer>
  )
}
