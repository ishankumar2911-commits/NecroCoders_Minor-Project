import React, { useState, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

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
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/auth/user`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);

  // ⏳ Loading state
  if (user === undefined) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500)
  }

  // ✅ Always render the app, navigation handled by useEffect
  return (
    <>
      <AlertNotification alert={alert} />
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
    </>
  )
}
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f9f9f9"
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "6px solid #d4f5d4",
    borderTop: "6px solid #28a745", // 🌱 green
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};

export default App