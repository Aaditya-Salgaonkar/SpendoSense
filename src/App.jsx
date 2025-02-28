import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import SignUp from "./screens/signup";
import Login from "./screens/login";
import Dashboard from "./screens/dashboard";
import LandingPage from "./screens/LandingPage";
import Expenses from "./screens/expenses";
import Insights from "./screens/insights";
const App = () => {
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);
  console.log(token);
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
    }
  }, [token]);

  return (
    
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <LandingPage />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            token ? <Dashboard token={token} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/expenses"
          element={
            token ? <Expenses uid={token?.user?.id} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/insights"
          element={
            token ? <Insights token={token} /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
