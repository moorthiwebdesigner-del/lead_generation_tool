function App() {

  const { token } = useAuth();


  return (
    <BrowserRouter>

      {/* Install Popup - All Pages */}
      <InstallPopup />


      <Routes>

        <Route
          path="/login"
          element={
            token 
            ? 
            <Navigate to="/" />
            :
            <Login />
          }
        />


        <Route
          element={
            token
            ?
            <Layout />
            :
            <Navigate to="/login" />
          }
        >

          <Route path="/" element={<Dashboard />} />

          <Route path="/search" element={<Search />} />

          <Route 
            path="/saved-leads" 
            element={<SavedLeads />} 
          />

          <Route 
            path="/analytics" 
            element={<Analytics />} 
          />

          <Route 
            path="/settings" 
            element={<Settings />} 
          />

        </Route>


      </Routes>

    </BrowserRouter>
  );
}

export default App;