import { useState } from "react";
import api from "../api/api";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import businessCategories from "../data/businessCategories";

function SearchPanel({ setLeads }) {
  const [query, setQuery] = useState("Restaurant");
  const [city, setCity] = useState("Chennai");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/search", {
        params: {
          query,
          city,
        },
      });

      setLeads(res.data.places || []);
    } catch (err) {
      console.error(err);
      alert("Search Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">

      <h2 className="text-2xl font-bold mb-6">
        🔍 Google Business Search
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Dropdown
    value={query}
    options={businessCategories}
    optionLabel="label"
    optionValue="value"
    filter
    showClear
    placeholder="Select Business Category"
    onChange={(e) => setQuery(e.value)}
    className="w-full"
/>

        <InputText
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        />

        <Button
          label="Search"
          icon="pi pi-search"
          loading={loading}
          onClick={handleSearch}
        />

        <Button
          label="Clear"
          icon="pi pi-times"
          severity="secondary"
          onClick={() => {
            setQuery("Restaurant");
            setCity("Chennai");
            setLeads([]);
          }}
        />

      </div>

    </div>
  );
}

export default SearchPanel;