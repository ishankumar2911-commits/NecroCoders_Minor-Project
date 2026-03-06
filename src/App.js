import React from 'react'
import Navbar from './components/Navigation/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './components/Home/Dashboard'
import SideNavbar from './components/Navigation/SideNavbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <SideNavbar />
      <Routes>
        <Route path='/' element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
