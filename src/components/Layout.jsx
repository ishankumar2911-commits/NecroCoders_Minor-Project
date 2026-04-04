import React from "react";
import Navbar from "./Navigation/Navbar";
import SideNavbar from "./Navigation/SideNavbar";
import { Outlet } from "react-router-dom";

function Layout({showAlert}) {
  return (
    <>
      <Navbar  showAlert={showAlert}  />
      <SideNavbar  showAlert={showAlert}  />
      <Outlet />
    </>
  );
}

export default Layout;