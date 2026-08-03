import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/Layout";

import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import SavedLeads from "./pages/SavedLeads";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";


import { useAuth } from "./context/AuthContext";

function App() {
  const { token } = useAuth();
  

  return (
    <BrowserRouter>
      <Routes>

        {/* Login Page (No Layout) */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/" /> : <Login />
          }
        />

        {/* Protected Routes */}
        <Route
          element={
            token ? <Layout /> : <Navigate to="/login" />
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/saved-leads" element={<SavedLeads />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;