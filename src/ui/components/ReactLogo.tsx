import $$ReactLogo from '../../assets/svgs/react-logo.svg?raw'

export function ReactLogo() {
  return (
    <figure className='logo' dangerouslySetInnerHTML={{ __html: $$ReactLogo }}/>
  )
}
