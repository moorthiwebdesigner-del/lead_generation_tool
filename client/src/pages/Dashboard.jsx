import { useEffect, useState } from "react";
import api from "../api/api";

import StatsCard from "../components/StatsCard";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function Dashboard() {
  const [stats, setStats] = useState({});
  const [followups, setFollowups] = useState([]);

  useEffect(() => {
    loadDashboard();
    loadFollowups();
  }, []);

  

const loadDashboard = async () => {
  try {

    const res = await api.get("/api/dashboard-stats");

    console.log("Dashboard API:", res.data);

    setStats(res.data || {});

  } catch (err) {

    console.log(err);
    setStats({});

  }
};


const loadFollowups = async () => {
  try {

    const res = await api.get("/api/today-followups");

    console.log("Followups API:", res.data);

    setFollowups(
      Array.isArray(res.data)
        ? res.data
        : []
    );

  } catch (err) {

    console.log(err);
    setFollowups([]);

  }
};


const followupBody = (row) => {
  if (!row.followup_date) return "-";

  const date = new Date(row.followup_date + "T00:00:00");

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  const statusBody = (row) => {
    const color = {
      New: "bg-blue-500",
      Contacted: "bg-yellow-500",
      Qualified: "bg-indigo-500",
      Proposal: "bg-purple-500",
      Won: "bg-green-600",
      Lost: "bg-red-600",
    };

    return (
      <span
        className={`${
          color[row.status] || "bg-gray-500"
        } text-white px-3 py-1 rounded-full text-xs`}
      >
        {row.status}
      </span>
    );
  };

  return (
    <div className="space-y-8">

      {/* Welcome */}

      <div className="bg-white rounded-2xl shadow-md p-6">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to Lead Generation CRM
        </p>

      </div>

      {/* Stats */}

      <StatsCard stats={stats} />

      {/* Today's Followups */}

      <div className="bg-white rounded-2xl shadow-md p-6">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-2xl font-bold">
            Today's Follow-ups
          </h2>

          <span className="text-gray-500">
            {followups.length} Leads
          </span>

        </div>

        <DataTable
          value={followups}
          paginator
          rows={5}
          stripedRows
          emptyMessage="No Follow-ups Today 🎉"
        >

          <Column
            field="business_name"
            header="Business"
          />

          <Column
            field="phone"
            header="Phone"
          />

          <Column
            field="status"
            header="Status"
            body={statusBody}
          />

          <Column
  header="Follow-up"
  body={followupBody}
/>
          <Column
            field="notes"
            header="Notes"
          />

        </DataTable>

      </div>

    </div>
  );
}

export default Dashboard;