import React from 'react'
import { Outlet } from 'react-router'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

export function Component() {
  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  )
}
