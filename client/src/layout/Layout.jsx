import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Layout() {

  const [sidebarOpen, setSidebarOpen] = useState();


  return (
    <div className="flex h-screen bg-slate-100">


      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />


      <div className="flex-1 flex flex-col overflow-hidden">


        <Navbar
          setSidebarOpen={setSidebarOpen}
        />


        <main className="
          flex-1
          overflow-y-auto
          p-3
          md:p-6
        ">
          <Outlet />
        </main>


      </div>

    </div>
  );
}

export default Layout;