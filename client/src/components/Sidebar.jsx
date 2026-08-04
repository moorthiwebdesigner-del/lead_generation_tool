import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaSearch,
  FaDatabase,
  FaFileExport,
  FaCog,
  FaTimes,
} from "react-icons/fa";

import logo from "../assets/logo.png";


function Sidebar({
  sidebarOpen,
  setSidebarOpen
}) {


  const menus = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/",
    },
    {
      title: "Search Leads",
      icon: <FaSearch />,
      path: "/search",
    },
    {
      title: "Saved Leads",
      icon: <FaDatabase />,
      path: "/saved-leads",
    },
    {
      title: "Analytics",
      icon: <FaFileExport />,
      path: "/analytics",
    },
    {
      title: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];



  return (

    <aside

      className={`
        fixed
        md:static
        top-0
        left-0
        z-[60]

        w-64
        h-screen

        bg-gradient-to-b
        from-[#020617]
        via-[#0f172a]
        to-[#172554]

        text-white

        flex
        flex-col

        transform
        transition-transform
        duration-300


        ${
          sidebarOpen
          ?
          "translate-x-0"
          :
          "-translate-x-full md:translate-x-0"
        }

      `}

    >





      {/* Mobile Close Button */}

      <div
        className="
          flex
          justify-end
          p-4
          md:hidden
        "
      >

        <button

          onClick={() => setSidebarOpen(false)}

          className="
            text-xl
            hover:text-blue-400
            cursor-pointer
            transition
          "

        >

          <FaTimes />

        </button>


      </div>







      {/* Logo Section */}


      <div

        className="
          p-5
          border-b
          border-slate-700
          flex
          flex-col
          items-center
          bg-[#020617]
        "

      >


        <img

          src={logo}

          alt="LeadGen CRM"

          className="
            w-48
            h-auto
            object-contain
            cursor-pointer
            drop-shadow-[0_0_18px_rgba(37,99,235,0.5)]
            hover:scale-105
            transition
            duration-300
          "

        />



        <h3

          className="
            text-white
            font-semibold
            text-lg
            mt-3
          "

        >

          LeadGen CRM

        </h3>




        <p

          className="
            text-xs
            text-blue-300
            mt-1
            tracking-widest
          "

        >

          BUSINESS CRM PLATFORM

        </p>



      </div>









      {/* Menu */}


      <nav

        className="
          flex-1
          mt-6
        "

      >


        {
          menus.map((menu)=>(


            <NavLink

              key={menu.title}

              to={menu.path}


              onClick={() =>
                setSidebarOpen(false)
              }



              className={({isActive}) =>

                `

                flex
                items-center
                gap-4

                px-6
                py-4

                transition
                duration-300

                group


                ${
                  isActive

                  ?

                  `
                  bg-gradient-to-r
                  from-blue-600
                  to-blue-500

                  shadow-lg
                  shadow-blue-900/50

                  border-r-4
                  border-white
                  `

                  :

                  `
                  hover:bg-blue-600/30
                  `
                }


                `
              }

            >



              <span

                className="
                  text-xl
                  group-hover:scale-110
                  transition
                "

              >

                {menu.icon}

              </span>





              <span

                className="
                  font-medium
                "

              >

                {menu.title}

              </span>



            </NavLink>


          ))
        }



      </nav>









      {/* Footer */}


      <div

        className="
          p-5
          border-t
          border-slate-700
        "

      >


        <p

          className="
            text-sm
            text-slate-400
          "

        >

          Version 1.0

        </p>




        <p

          className="
            text-xs
            text-slate-500
            mt-2
          "

        >

          © 2026 Moorthi Web Studio

        </p>



      </div>







    </aside>

  );

}


export default Sidebar;