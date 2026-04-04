import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'

import Dashboard from './components/Home/Dashboard'
import BinStatusPage from './components/BinStatus/BinStatusHome'
import SanitationStaffPage from './components/SanitationStaffs/SanitationStaffPage'
import Reports from './components/Reports/ReportsPage'
import Login from './components/LoginPage/Login'
import SettingsPage from './components/Settings/SettingsPage'
import Bell from './components/Notifications/Bell'
import AlertNotification from './components/AlertNotification/AlertNotification'
import Search from './components/Navigation/Search'

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500)
  }
  return (
    <>
      <AlertNotification alert={alert} />
      <BrowserRouter>
        <Routes>

          {/* Login page without navbar */}
          <Route path='/login' element={<Login showAlert={showAlert} />} />

          {/* Pages with navbar + sidebar */}
          <Route element={<Layout showAlert={showAlert} />}>
            <Route path='/' element={<Dashboard showAlert={showAlert} />} />
            <Route path='/bin-status' element={<BinStatusPage showAlert={showAlert} />} />
            <Route path='/staffs' element={<SanitationStaffPage showAlert={showAlert} />} />
            <Route path='/reports' element={<Reports showAlert={showAlert} />} />
            <Route path='/settings' element={<SettingsPage showAlert={showAlert} />} />
            <Route path='/alerts' element={<Bell showAlert={showAlert} />} />
            <Route path='/search' element={<Search showAlert={showAlert} />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App