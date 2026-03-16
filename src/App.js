import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'

import Dashboard from './components/Home/Dashboard'
import BinStatusPage from './components/BinStatus/BinStatusHome'
import SanitationStaffPage from './components/SanitationStaffs/SanitationStaffPage'
import Reports from './components/Reports/ReportsPage'
import Login from './components/LoginPage/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login page without navbar */}
        <Route path='/login' element={<Login />} />

        {/* Pages with navbar + sidebar */}
        <Route element={<Layout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/bin-status' element={<BinStatusPage />} />
          <Route path='/staffs' element={<SanitationStaffPage />} />
          <Route path='/reports' element={<Reports />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App