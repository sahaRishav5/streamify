import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <Sidebar />}
        <main
          className={`flex-1 overflow-y-auto ${showSidebar ? "lg:ml-64" : ""} w-full`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
