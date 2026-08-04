import {
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/logo.png";


function Navbar({ setSidebarOpen }) {


  const user = JSON.parse(
    localStorage.getItem("user")
  );


  const navigate = useNavigate();

  const { logout } = useAuth();



  const handleLogout = () => {

    logout();

    navigate("/login");

  };



  return (

    <header

      className="
        h-16
        bg-white
        border-b
        border-gray-200

        flex
        items-center
        justify-between

        px-3
        md:px-8

        sticky
        top-0

        z-50
      "

    >





      {/* Left Section */}

      <div className="
        flex
        items-center
        gap-3
      ">




        {/* Mobile Menu */}

        <button

          onClick={() =>
            setSidebarOpen(true)
          }

          className="
            md:hidden
            text-2xl
            text-slate-700
            hover:text-blue-600
            cursor-pointer
          "

        >

          <FaBars />

        </button>







        {/* Logo */}


        <img

          src={logo}

          alt="LeadGen CRM"

          onClick={() =>
            navigate("/")
          }

          className="
            w-28
            md:w-36

            h-auto

            cursor-pointer

            hover:scale-105

            transition
            duration-300
          "

        />



      </div>









      {/* Search */}


      <div

        className="
          hidden
          md:block
          w-96
        "

      >


        <input

          type="text"

          placeholder="Search leads..."

          className="
            w-full

            border
            border-gray-300

            rounded-xl

            px-4
            py-2

            outline-none

            focus:ring-2
            focus:ring-blue-500
          "

        />


      </div>









      {/* Right Section */}


      <div

        className="
          flex
          items-center
          gap-3
          md:gap-6
        "

      >






        {/* Notification */}


        <button

          className="
            relative
            cursor-pointer
          "

        >


          <FaBell

            className="
              text-xl
              md:text-2xl

              text-gray-600

              hover:text-blue-600
            "

          />



          <span

            className="
              absolute

              -top-2
              -right-2

              w-5
              h-5

              rounded-full

              bg-red-500

              text-white

              text-xs

              flex
              items-center
              justify-center
            "

          >

            3

          </span>



        </button>









        {/* User */}


        <div

          className="
            flex
            items-center
            gap-2
          "

        >



          <FaUserCircle

            className="
              text-3xl
              md:text-4xl

              text-blue-600
            "

          />




          <div

            className="
              hidden
              md:block
            "

          >


            <h3

              className="
                font-semibold
                text-slate-800
              "

            >

              {user?.name || "Admin"}


            </h3>




            <p

              className="
                text-sm
                text-gray-500
              "

            >

              {user?.role || "Administrator"}


            </p>


          </div>



        </div>









        {/* Logout */}


        <button

          onClick={handleLogout}

          className="
            flex
            items-center
            gap-2

            bg-red-600

            hover:bg-red-700

            text-white

            px-3
            md:px-4

            py-2

            rounded-lg

            transition

            cursor-pointer
          "

        >


          <FaSignOutAlt />



          <span

            className="
              hidden
              md:block
            "

          >

            Logout

          </span>



        </button>





      </div>





    </header>


  );

}


export default Navbar;