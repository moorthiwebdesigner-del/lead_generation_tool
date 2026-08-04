import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/logo.png";


function Login() {


  const { login: authLogin } = useAuth();

  const navigate = useNavigate();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);



  const login = async (e) => {

    e.preventDefault();


    try {


      const res = await api.post("/api/login", {

        email,

        password,

      });



      authLogin(

        res.data.token,

        res.data.user

      );



      navigate("/");



    } catch (err) {


      console.error(err);

      alert("Invalid Email or Password");


    }

  };





  return (


    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-slate-100
      via-white
      to-blue-100
      px-4
    ">


      <form

        onSubmit={login}

        className="
          bg-white
          w-full
          max-w-md
          rounded-3xl
          shadow-2xl
          p-8
          border
          border-gray-100
        "

      >



        {/* Logo */}


        <div

          className="
            flex
            flex-col
            items-center
            mb-8
          "

        >


          <img

            src={logo}

            alt="LeadGen CRM"

            onClick={() => navigate("/")}

            className="
              w-52
              h-auto
              mb-4
              cursor-pointer
              hover:scale-105
              transition
              duration-300
            "

          />



          <p className="
            text-gray-500
            text-sm
          ">

            Business Lead Management CRM

          </p>



        </div>






        <h1 className="
          text-2xl
          font-bold
          text-center
          text-slate-800
          mb-6
        ">

          Welcome Back 👋

        </h1>







        {/* Email */}


        <input


          type="email"


          placeholder="Email Address"


          className="
            w-full
            border
            border-gray-300
            p-3
            rounded-xl
            mb-4
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "



          value={email}


          onChange={(e)=>setEmail(e.target.value)}


        />







        {/* Password */}


        <div className="
          relative
          mb-6
        ">



          <input


            type={
              showPassword
              ?
              "text"
              :
              "password"
            }



            placeholder="Password"



            className="
              w-full
              border
              border-gray-300
              p-3
              pr-12
              rounded-xl
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "



            value={password}



            onChange={
              (e)=>setPassword(e.target.value)
            }



          />






          <button


            type="button"


            onClick={() =>
              setShowPassword(!showPassword)
            }



            className="
              absolute
              right-4
              top-3.5
              text-gray-500
              hover:text-blue-600
              cursor-pointer
            "


          >


            {
              showPassword

              ?

              <FaEyeSlash size={20}/>

              :

              <FaEye size={20}/>

            }


          </button>



        </div>







        {/* Login Button */}



        <button


          type="submit"


          className="
            w-full
            bg-gradient-to-r
            from-blue-900
            to-blue-600
            hover:from-blue-800
            hover:to-blue-500
            text-white
            font-semibold
            p-3
            rounded-xl
            shadow-lg
            transition
            duration-300
            cursor-pointer
          "


        >


          Login


        </button>







        <p className="
          text-center
          text-xs
          text-gray-400
          mt-6
        ">


          © 2026 LeadGen CRM


        </p>





      </form>


    </div>


  );


}


export default Login;