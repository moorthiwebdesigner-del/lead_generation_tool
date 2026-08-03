import { useEffect, useState } from "react";
import api from "../api/api";

import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";


function Analytics() {

  const [data, setData] = useState([]);


  useEffect(() => {

    loadAnalytics();

  }, []);



  const loadAnalytics = async () => {

    try {

      const res = await api.get("/api/analytics");

      setData(res.data);

    } catch (err) {

      console.log(err);

    }

  };



  const getCount = (status) => {

    const item = data.find(
      x => x.status === status
    );

    return item ? Number(item.total) : 0;

  };



  const totalLeads = data.reduce(
    (sum, item) =>
      sum + Number(item.total),
    0
  );



  const wonLeads = getCount("Won");



  const conversionRate =
    totalLeads > 0
      ? Math.round(
          (wonLeads / totalLeads) * 100
        )
      : 0;



  const statusList = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal",
    "Won",
    "Lost",
  ];



  return (

    <div>


      <h1 className="
      text-2xl
      font-bold
      mb-6
      ">
        Analytics
      </h1>




      {/* Total Leads Card */}

      <div className="
      bg-white
      rounded-2xl
      shadow
      p-6
      mb-8
      ">

        <div className="
        flex
        items-center
        justify-between
        ">


          <div>

            <p className="text-gray-500">
              Total Leads
            </p>


            <h2 className="
            text-4xl
            font-bold
            mt-2
            ">
              {totalLeads}
            </h2>


          </div>


          <div className="
          bg-blue-500
          text-white
          w-14
          h-14
          rounded-xl
          flex
          items-center
          justify-center
          text-2xl
          ">

            <FaUsers />

          </div>


        </div>


      </div>






      {/* Status */}

      <div className="
      bg-white
      rounded-2xl
      shadow
      p-6
      ">


        <h2 className="
        text-xl
        font-bold
        mb-5
        ">
          Lead Status
        </h2>




        {
          statusList.map((status)=>(


            <div
            key={status}
            className="
            flex
            justify-between
            py-3
            border-b
            "
            >


              <span>
                {status}
              </span>


              <span className="
              font-bold
              ">
                {getCount(status)}
              </span>


            </div>


          ))
        }



      </div>







      {/* Conversion Rate */}


      <div className="
      mt-8
      bg-white
      rounded-2xl
      shadow
      p-6
      ">


        <div className="
        flex
        justify-between
        mb-3
        ">


          <h2 className="
          text-xl
          font-bold
          ">
            Conversion Rate
          </h2>


          <span className="
          font-bold
          text-green-600
          ">
            {conversionRate}%
          </span>


        </div>





        <div className="
        w-full
        bg-gray-200
        rounded-full
        h-4
        ">


          <div
          className="
          bg-green-500
          h-4
          rounded-full
          "
          style={{
            width:`${conversionRate}%`
          }}
          >


          </div>


        </div>



        <p className="
        text-sm
        text-gray-500
        mt-3
        ">

          Won Leads / Total Leads

        </p>



      </div>



    </div>

  );

}


export default Analytics;