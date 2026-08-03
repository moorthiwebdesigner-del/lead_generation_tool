import {
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


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


      {/* Left Logo + Mobile Menu */}

      <div className="flex items-center gap-3">


        {/* Hamburger */}

        <button
          onClick={() => setSidebarOpen(true)}
          className="
          md:hidden
          text-2xl
          text-gray-700
          "
        >
          <FaBars />
        </button>



        {/* Logo */}

        <h1 className="
          text-xl
          md:text-2xl
          font-bold
          text-blue-600
        ">
          Lead
          <span className="text-gray-900">
            Gen
          </span>
        </h1>


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
          "
        >

          <FaBell
            className="
            text-xl
            md:text-2xl
            text-gray-600
            hover:text-blue-600
            cursor-pointer
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

            <h3 className="font-semibold">

              {user?.name || "Admin"}

            </h3>


            <p className="text-sm text-gray-500">

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
          "
        >

          <FaSignOutAlt />


          <span className="hidden md:block">
            Logout
          </span>


        </button>



      </div>



    </header>

  );

}


export default Navbar;