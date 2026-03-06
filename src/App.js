import React from 'react'
import Navbar from './components/Navigation/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './components/Home/Dashboard'
import SideNavbar from './components/Navigation/SideNavbar'
import BinStatusPage from './components/BinStatus/BinStatusHome'
import SanitationStaffPage from './components/SanitationStaffs/SanitationStaffPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <SideNavbar />
      <Routes>
        <Route path='/' element={<Dashboard />}/>
        <Route path='/bin-status' element={<BinStatusPage />}/>
        <Route path='/staffs' element={<SanitationStaffPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
