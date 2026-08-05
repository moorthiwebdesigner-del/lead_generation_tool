import { useState, useEffect, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import api from "../api/api";
import MobileLeadCard from "./MobileLeadCard";
import { Toast } from "primereact/toast";


function LeadTable({
  leads,
  savedLeads,
  refreshSaved
}) {

const [savedStatus, setSavedStatus] = useState([]);

const toast = useRef(null);

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


      toast.current.show({
    severity:"success",
    summary:"Lead Saved",
    detail:"Business lead saved successfully",
    life:3000
});


setSavedStatus(prev => [
  ...prev,
  lead.displayName?.text
]);

  
      await refreshSaved();

       

    } catch (err) {


      console.error(err);


     toast.current.show({
  severity:"error",
  summary:"Save Failed",
  detail:
    err.response?.data?.message ||
    "Failed to save lead",
  life:3000
});


    }

  };



  // Check Already Saved
const isSaved = (row) => {



  const localSaved = savedStatus.some(
    name =>
      name?.trim().toLowerCase() ===
      row.displayName?.text?.trim().toLowerCase()
  );

  if(localSaved)
    return true;


  return savedLeads?.some((item)=>{

    return (
      item.business_name
      ?.trim()
      .toLowerCase()
      ===
      row.displayName?.text
      ?.trim()
      .toLowerCase()
    );

  });

};


  const businessBody = (row) => (

    <span className="font-semibold">
      {row.displayName?.text}
    </span>

  );



  const phoneBody = (row) => (

    <span>
      {row.nationalPhoneNumber || "-"}
    </span>

  );



  const websiteBody = (row) => (

    row.websiteUri ?

      <a
        href={row.websiteUri}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 hover:underline"
      >
        Visit
      </a>

      :

      "-"

  );

  const ratingBody = (row) => (

    <span className="font-semibold text-yellow-500">

      ⭐ {row.rating || "-"}

    </span>

  );



  const addressBody = (row) => (

    <span className="text-sm">

      {row.formattedAddress || "-"}

    </span>

  );



  // Save Button

  const actionBody = (row) => {

    const saved = isSaved(row);


    return (

      <button

        disabled={saved}

        onClick={() => saveLead(row)}

        className={

          saved

          ?

          "bg-green-600 text-white px-4 py-2 rounded-lg cursor-not-allowed"

          :

          "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"

        }

      >

        {saved ? "✅ Saved" : "💾 Save"}

      </button>

    );

  };


  const [isMobile, setIsMobile] = useState(false);


useEffect(() => {

  const checkScreen = () => {

    setIsMobile(window.innerWidth < 768);

  };


  checkScreen();

  window.addEventListener(
    "resize",
    checkScreen
  );


  return () => {

    window.removeEventListener(
      "resize",
      checkScreen
    );

  };


}, []);


return (
<>
<Toast ref={toast} />

  <div className="bg-white rounded-2xl shadow-lg p-4">


    {isMobile ? (

      <MobileLeadCard

        leads={leads}

        savedLeads={savedLeads}

        refreshSaved={refreshSaved}

        savedStatus={savedStatus}
        
  setSavedStatus={setSavedStatus}

      />


    ) : (


      <DataTable

      key={savedStatus.length}

        value={leads}

        paginator

        rows={10}

        rowsPerPageOptions={[10,20,50]}

        stripedRows

        responsiveLayout="scroll"

        emptyMessage="No businesses found."

      >

        <Column
          header="Business"
          body={businessBody}
        />


        <Column
          header="Phone"
          body={phoneBody}
        />


        <Column
          header="Website"
          body={websiteBody}
        />


        <Column
          header="Rating"
          body={ratingBody}
        />


        <Column
          header="Address"
          body={addressBody}
        />


        <Column
          header="Action"
          body={actionBody}
        />


      </DataTable>


    )}


  </div>
</>

);

}


export default LeadTable;