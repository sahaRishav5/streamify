import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main
          className={`flex-1 ${showSidebar ? "lg:ml-64" : ""} overflow-y-auto`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
