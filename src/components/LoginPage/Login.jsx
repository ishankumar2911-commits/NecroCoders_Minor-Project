import React, { useState } from "react";

function Login({showAlert}) {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();
    showAlert("Invalid credentials. Please try again.", "danger");
  }

  const handleOutlookLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/microsoft`;
    if (window.location.href.includes("error=access_denied")) {
      showAlert("Microsoft login failed. Please try again.", "danger");
    }else {
      setTimeout(() => {
        showAlert("Logged in successfully with Microsoft!", "success");
      }, 1000);
    }

  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        fontFamily: "Segoe UI, sans-serif",
        background: "#f5f7f6",
        overflow: "hidden"
      }}
    >

      {/* LEFT IMAGE SECTION */}
      <div
        style={{
          flex: 6.6,
          backgroundImage:
            "url('https://plus.unsplash.com/premium_vector-1718815211233-10dfdda70419?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >

        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)"
          }}
        />

        {/* Branding */}
        <div
          style={{
            position: "relative",
            textAlign: "center",
            padding: "40px",
            maxWidth: "500px"
          }}
        >
          <h1 style={{ fontSize: "46px", marginBottom: "10px" }}>
            CleanTrack
          </h1>

          <p style={{ fontSize: "18px", opacity: 0.9 }}>
            Smart Waste Monitoring & Management System
          </p>
        </div>

      </div>


      {/* RIGHT LOGIN SECTION */}
      <div
        style={{
          flex: 3.4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          //padding: "40px"
        }}
      >

        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#fff",
            padding: "45px",
            borderRadius: "14px",
            boxShadow: "0 12px 35px rgba(0,0,0,0.08)"
          }}
        >

          <h2 style={{ marginBottom: "6px", color: "#25671E" }}>
            Welcome Back
          </h2>

          <p
            style={{
              color: "#777",
              marginBottom: "28px",
              fontSize: "14px"
            }}
          >
            Login to your CleanTrack dashboard
          </p>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "14px", color: "#444" }}>
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "14px"
                }}
              />
            </div>


            {/* PASSWORD */}
            <div style={{ marginBottom: "22px" }}>
              <label style={{ fontSize: "14px", color: "#444" }}>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "14px"
                }}
              />
            </div>


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "13px",
                background: "#25671E",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "500",
                cursor: "pointer",
                marginBottom: "18px"
              }}
            >
              Login
            </button>

          </form>


          {/* OR DIVIDER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "22px 0"
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#ddd" }} />
            <span style={{ margin: "0 10px", fontSize: "13px", color: "#777" }}>
              OR
            </span>
            <div style={{ flex: 1, height: "1px", background: "#ddd" }} />
          </div>


          {/* OUTLOOK LOGIN */}
          <button
            onClick={handleOutlookLogin}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontSize: "14px"
            }}
          >
            <img
              src="https://img.icons8.com/color/24/microsoft-outlook-2019.png"
              alt="outlook"
            />
            Sign in with Outlook
          </button>

          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              fontSize: "11px",
              color: "#aaa",
              lineHeight: "1.4"
            }}
          >
            © 2026 CleanTrack • Team NecroCoders
          </div>
        </div>

      </div>

    </div>
  );
}

export default Login;