import { useEffect, useState } from "react";

import logo from "/favicon.png";


function InstallPopup() {


  const [installPrompt, setInstallPrompt] = useState(null);

  const [show, setShow] = useState(false);



  useEffect(() => {


    const closed =
      localStorage.getItem(
        "installPopupClosed"
      );


    const handler = (e) => {


      e.preventDefault();


      setInstallPrompt(e);



      // Already closed na show pannathu

      if(!closed){

        setTimeout(()=>{

          setShow(true);

        },2000);

      }


    };



    window.addEventListener(
      "beforeinstallprompt",
      handler
    );



    return () => {


      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );


    };


  },[]);







  const installApp = async()=>{


    if(!installPrompt)
      return;



    installPrompt.prompt();



    const result =
      await installPrompt.userChoice;



    if(
      result.outcome === "accepted"
    ){

      console.log(
        "App Installed"
      );

    }



    setShow(false);


  };







  const closePopup = ()=>{


    localStorage.setItem(
      "installPopupClosed",
      "true"
    );


    setShow(false);


  };








  if(!show)
    return null;







  return (


    <div

      className="
      fixed
      bottom-5
      right-5
      left-5
      md:left-auto
      md:w-96
      bg-white
      rounded-3xl
      shadow-2xl
      border
      border-gray-200
      p-5
      z-[9999]
      animate-bounce
      "

    >



      <div
        className="
        flex
        items-center
        gap-4
        "
      >



        <img

          src={logo}

          alt="Lead CRM"

          className="
          w-16
          h-16
          rounded-2xl
          shadow
          "

        />



        <div>


          <h2

            className="
            text-lg
            font-bold
            text-slate-800
            "

          >

            Install Lead CRM 📱

          </h2>



          <p

            className="
            text-sm
            text-gray-500
            "

          >

            Quick access from your home screen

          </p>


        </div>



      </div>








      <div

        className="
        flex
        justify-end
        gap-3
        mt-5
        "

      >



        <button


          onClick={closePopup}


          className="
          px-4
          py-2
          rounded-xl
          bg-gray-200
          text-gray-700
          hover:bg-gray-300
          transition
          "

        >

          Later

        </button>






        <button


          onClick={installApp}


          className="
          px-5
          py-2
          rounded-xl
          bg-blue-600
          text-white
          font-semibold
          hover:bg-blue-700
          transition
          shadow-lg
          "

        >

          Install

        </button>



      </div>





    </div>


  );


}



export default InstallPopup;