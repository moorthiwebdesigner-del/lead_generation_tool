import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import api from "../api/api";

function LeadTable({ leads }) {

  const saveLead = async (lead) => {
    try {
      await api.post("/api/save-lead", {
        business_name: lead.displayName?.text,
        phone: lead.nationalPhoneNumber || "",
        website: lead.websiteUri || "",
        rating: lead.rating || 0,
        address: lead.formattedAddress || "",
      });

      alert("✅ Lead Saved Successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to Save Lead");
    }
  };

  const businessBody = (row) => (
    <span className="font-semibold">
      {row.displayName?.text}
    </span>
  );

  const phoneBody = (row) => (
    row.nationalPhoneNumber || "-"
  );

  const websiteBody = (row) =>
    row.websiteUri ? (
      <a
        href={row.websiteUri}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 hover:underline"
      >
        Visit
      </a>
    ) : (
      "-"
    );

  const ratingBody = (row) => (
    <span className="font-semibold text-yellow-500">
      ⭐ {row.rating || "-"}
    </span>
  );

  const addressBody = (row) => (
    <span>{row.formattedAddress}</span>
  );

  const actionBody = (row) => (
    <button
      onClick={() => saveLead(row)}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
    >
      💾 Save
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">

      <DataTable
        value={leads}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        stripedRows
        responsiveLayout="scroll"
        sortMode="multiple"
        emptyMessage="No businesses found."
      >

        <Column
          field="displayName.text"
          header="Business"
          sortable
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
          field="rating"
          header="Rating"
          sortable
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

    </div>
  );
}

export default LeadTable;