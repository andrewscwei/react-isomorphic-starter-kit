import { Outlet } from 'react-router'
import { Footer } from '../components/Footer.js'
import { Header } from '../components/Header.js'

export function Component() {
  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  )
}
