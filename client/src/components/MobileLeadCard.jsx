import api from "../api/api";


function MobileLeadCard({
  leads,
  savedLeads,
  refreshSaved,
   savedStatus,
  setSavedStatus
}) {


  const saveLead = async (lead) => {

    try {

      await api.post("/api/save-lead", {

        business_name:
          lead.displayName?.text,

        phone:
          lead.nationalPhoneNumber || "",

        website:
          lead.websiteUri || "",

        rating:
          lead.rating || 0,

        address:
          lead.formattedAddress || "",

      });


     setSavedStatus(prev => [
  ...prev,
  lead.displayName?.text
]);

      await refreshSaved();


    } catch(err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Save Failed"
      );

    }

  };

const isSaved = (lead) => {

  const localSaved = savedStatus?.some(
    name =>
      name?.trim().toLowerCase() ===
      lead.displayName?.text?.trim().toLowerCase()
  );

  if(localSaved)
    return true;


  return savedLeads?.some(item =>
    item.business_name?.trim().toLowerCase() ===
    lead.displayName?.text?.trim().toLowerCase()
  );

};
    return (

    <div className="space-y-4">

      {leads.map((lead, index) => {

        const saved = isSaved(lead);


        return (

          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100"
          >

            {/* Business Name */}

            <div className="flex justify-between items-start">

              <h3 className="text-lg font-bold text-gray-800">

                {lead.displayName?.text}

              </h3>


              {saved && (

                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">

                  Saved

                </span>

              )}

            </div>



            {/* Details */}

            <div className="mt-4 mb-3 space-y-3 text-sm">


              <p>

                📞

                <span className="ml-2">

                  {lead.nationalPhoneNumber || "-"}

                </span>

              </p>



              <p>

                ⭐

                <span className="ml-2">

                  {lead.rating || "-"}

                </span>

              </p>



              <p>

                📍

                <span className="ml-2">

                  {lead.formattedAddress || "-"}

                </span>

              </p>



              {lead.websiteUri && (

                <p>

                  🌐

                  <a
                    href={lead.websiteUri}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 text-blue-600"
                  >

                    Visit Website

                  </a>

                </p>

              )}


            </div>



            {/* Button */}

           <button
 disabled={isSaved(lead)}
 onClick={() => saveLead(lead)}
 className={
   isSaved(lead)
   ?
   "bg-green-600 text-white px-4 py-2 rounded-lg"
   :
   "bg-blue-600 text-white px-4 py-2 rounded-lg"
 }
>
{
 isSaved(lead)
 ? "✅ Saved"
 : "💾 Save"
}
</button>


          </div>

        );

      })}


    </div>

  );

}


export default MobileLeadCard;