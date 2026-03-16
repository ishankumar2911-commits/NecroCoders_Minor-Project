import React from "react";
import Navbar from "./Navigation/Navbar";
import SideNavbar from "./Navigation/SideNavbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Navbar />
      <SideNavbar />
      <Outlet />
    </>
  );
}

export default Layout;