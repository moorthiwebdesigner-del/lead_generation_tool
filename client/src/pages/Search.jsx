import { useState, useEffect } from "react";
import SearchPanel from "../components/SearchPanel";
import LeadTable from "../components/LeadTable";
import api from "../api/api";


function Search() {

  const [leads, setLeads] = useState([]);

  const [savedLeads, setSavedLeads] = useState([]);



  useEffect(() => {
    fetchSavedLeads();
  }, []);



  const fetchSavedLeads = async () => {

    try {

      const res = await api.get("/api/saved-leads");

      setSavedLeads(res.data);

    } catch (err) {

      console.log(err);

    }

  };



  return (
    <>
      <SearchPanel setLeads={setLeads} />


      <div className="mt-8">

        <LeadTable
          leads={leads}
          savedLeads={savedLeads}
          refreshSaved={fetchSavedLeads}
        />

      </div>

    </>
  );
}


export default Search;