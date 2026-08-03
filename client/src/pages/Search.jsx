import { useState } from "react";
import SearchPanel from "../components/SearchPanel";
import LeadTable from "../components/LeadTable";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

function Search() {
  const [leads, setLeads] = useState([]);

  return (
    <>
      <SearchPanel setLeads={setLeads} />

      <div className="mt-8">
        <LeadTable leads={leads} />
      </div>
    </>
  );
}

export default Search;