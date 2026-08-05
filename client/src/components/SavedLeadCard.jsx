import { FaWhatsapp } from "react-icons/fa";


function SavedLeadCard({
  leads,
  editLead,
  deleteLead,
  openWhatsApp
}) {


  return (

    <div className="space-y-4">


      {leads.map((lead)=> (


        <div
          key={lead.id}
          className="
          bg-white
          rounded-2xl
          shadow-lg
          p-5
          border
          border-gray-100
          "
        >


          {/* Header */}

          <div className="flex justify-between items-start">


            <h3 className="
              text-lg
              font-bold
              text-gray-800
            ">

              {lead.business_name}

            </h3>



            <span
              className="
              bg-green-100
              text-green-700
              px-3
              py-1
              rounded-full
              text-xs
              font-semibold
              "
            >

              {lead.status || "New"}

            </span>


          </div>




          {/* Details */}


          <div className="
            mt-4
            space-y-3
            text-sm
            text-gray-600
          ">


            <p>
              📞 {lead.phone || "-"}
            </p>


            <p>
              ⭐ {lead.rating || "-"}
            </p>


            <p>
              📍 {lead.address || "-"}
            </p>



            {lead.website && (

              <a
                href={lead.website}
                target="_blank"
                rel="noreferrer"
                className="
                text-blue-600
                "
              >

                🌐 Visit Website

              </a>

            )}



            {lead.followup_date && (

              <p>

                📅 
                {
                  new Date(
                    lead.followup_date
                  ).toLocaleDateString("en-IN")
                }

              </p>

            )}



            {lead.notes && (

              <p>

                📝 {lead.notes}

              </p>

            )}



          </div>





          {/* Buttons */}


          <div className="
            flex
            gap-3
            mt-5
          ">


            <button

              onClick={()=>
                editLead(lead)
              }

              className="
              flex-1
              bg-yellow-500
              text-white
              py-2
              rounded-xl
              "

            >

              ✏️ Edit

            </button>





            <button

              onClick={()=>
                deleteLead(lead.id)
              }

              className="
              flex-1
              bg-red-500
              text-white
              py-2
              rounded-xl
              "

            >

              🗑 Delete

            </button>





            <button

              onClick={()=>
                openWhatsApp(lead)
              }

              className="
              bg-green-500
              text-white
              px-4
              rounded-xl
              "

            >

              <FaWhatsapp/>

            </button>



          </div>



        </div>


      ))}



    </div>


  );

}


export default SavedLeadCard;