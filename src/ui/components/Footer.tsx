import { useLocalizedString } from '@lib/i18n'
import { type HTMLAttributes } from 'react'
import $$GitHubLogo from '../assets/images/github-logo.svg'

type Props = HTMLAttributes<HTMLElement>

export function Footer({ ...props }: Readonly<Props>) {
  const ltxt = useLocalizedString()

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
      <a
        aria-label={ltxt('en')}
        className='icon'
        href='/'
        style={{ background: 'var(--color-dark-grey)' }}
      >
        {ltxt('en')}
      </a>
      <a
        aria-label={ltxt('ja')}
        className='icon'
        href='/ja'
        style={{ background: 'var(--color-dark-grey)', marginLeft: '1rem' }}
      >
        {ltxt('ja')}
      </a>
    </footer>
  )
}
