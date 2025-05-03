import React from 'react'
import Navbar from '../components/navbar'
import { Outlet } from 'react-router-dom'

const mainLayout = () => {
  return (
    <>
    <Navbar />
    <Outlet />
    </>
  )
}

export default mainLayout