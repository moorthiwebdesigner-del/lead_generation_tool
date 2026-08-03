import { useEffect, useState, useRef } from "react";
import api from "../api/api";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { FaWhatsapp } from "react-icons/fa";

function SavedLeads() {
const openWhatsApp = (row) => {
  if (!row.phone) {
    alert("Phone number not available");
    return;
  }

  let phone = row.phone.replace(/\D/g, "");

  // இந்திய Mobile Number
  if (phone.length === 11 && phone.startsWith("0")) {
    phone = "91" + phone.substring(1);
  } else if (phone.length === 10) {
    phone = "91" + phone;
  }

  const business = row.business_name || "Business";
  const address = row.address || "";

  const message = `Hi Sir/Madam,

Greetings from Code6 Technologies.

Regarding:
${business}
${address}

We have 15+ years of experience in Website Design & Development.

Our Services:
• Business Website
• School Website
• E-Commerce Website
• Logo Design
• Brochure Design
• Business Card Design
• SEO & Digital Marketing

If you are interested, we would be happy to discuss your requirements.

Contact:
Moorthi

Mobile: +91 9629301506
Email: moorthiwebdesigner@gmail.com

Website:
https://code6technologies.com/

Portfolio:
https://moorthi-portfolio.vercel.app/

Thank you.`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
};

  const [leads, setLeads] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [visible, setVisible] = useState(false);
const [selectedLead, setSelectedLead] = useState(null);

const [status, setStatus] = useState("New");
const [notes, setNotes] = useState("");
const [followup, setFollowup] = useState(null);

const statuses = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Won",
  "Lost",
];

  const dt = useRef(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/api/saved-leads");
      setLeads(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;

    try {
      await api.delete(`/api/saved-leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const websiteBody = (row) =>
    row.website ? (
      <a
        href={row.website}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600"
      >
        Visit
      </a>
    ) : (
      "-"
    );

  const ratingBody = (row) => (
    <span>⭐ {row.rating}</span>
  );

  const editLead = (lead) => {

     console.log(lead.followup_date);
  console.log(typeof lead.followup_date);

  setSelectedLead(lead);

  setStatus(lead.status || "New");
  setNotes(lead.notes || "");

   if (lead.followup_date) {
    const date = new Date(lead.followup_date);
    setFollowup(date);
  } else {
    setFollowup(null);
  }

  setVisible(true);
};

const actionBody = (row) => (
  <div className="flex gap-2">
    <Button
      icon="pi pi-pencil"
      severity="warning"
      onClick={() => editLead(row)}
    />

    <Button
      icon="pi pi-trash"
      severity="danger"
      onClick={() => deleteLead(row.id)}
    />

     <button
      onClick={() => openWhatsApp(row)}
      className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-2"
      title="Send WhatsApp"
    >
      <FaWhatsapp size={18} />
    </button>
    
  </div>
);

  const exportCSV = () => {
    dt.current.exportCSV();
  };


  const followupBody = (row) => {
  if (!row.followup_date) return "-";

  const date = new Date(row.followup_date);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
  const updateLead = async () => {
  try {
    await api.put(
      `/api/update-lead/${selectedLead.id}`,
      {
        status,
        notes,
         followup_date: followup
    ? formatDate(followup)
    : null,
      }
    );

    setVisible(false);

    fetchLeads();

    alert("Lead Updated Successfully");
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Saved Leads
        </h1>

        <div className="flex gap-3">

          <InputText
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />

          <Button
            label="Export CSV"
            icon="pi pi-download"
            onClick={exportCSV}
          />

        </div>

      </div>

      <DataTable
        ref={dt}
        value={leads}
        paginator
        rows={10}
        rowsPerPageOptions={[10,20,50]}
        stripedRows
        showGridlines
        globalFilter={globalFilter}
        emptyMessage="No Saved Leads"
      >

        <Column
          field="business_name"
          header="Business"
          sortable
        />

        <Column
          field="phone"
          header="Phone"
          sortable
        />

        <Column
          header="Website"
          body={websiteBody}
        />

        <Column
          field="rating"
          header="Rating"
          sortable
          body={ratingBody}
        />

        <Column
          field="address"
          header="Address"
        />

        <Column
  field="status"
  header="Status"
/>
<Column
  header="Follow-up"
  body={followupBody}
/>

<Column
  field="notes"
  header="Notes"
/>

        <Column
          header="Action"
          body={actionBody}
        />

      </DataTable>
<Dialog
  header="Update Lead"
  visible={visible}
  style={{ width: "500px" }}
  onHide={() => setVisible(false)}
>

  <div className="flex flex-col gap-4">

    <Dropdown
      value={status}
      options={statuses}
      onChange={(e) => setStatus(e.value)}
      placeholder="Status"
    />

    <Calendar
      value={followup}
      onChange={(e) => setFollowup(e.value)}
      dateFormat="dd/mm/yy"
      showIcon
    />

    <InputTextarea
      rows={5}
      value={notes}
      onChange={(e)=>setNotes(e.target.value)}
      placeholder="Notes"
    />

    <Button
      label="Save Changes"
      icon="pi pi-check"
      onClick={updateLead}
    />

  </div>

</Dialog>
    </div>
  );
}

export default SavedLeads;