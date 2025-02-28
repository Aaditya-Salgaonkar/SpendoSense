import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import SignUp from "./screens/signup";
import Login from "./screens/login";
import Dashboard from "./screens/Dashboard";
import LandingPage from "./screens/LandingPage";
import Expenses from "./screens/expenses";
import Insights from "./screens/insights";
import AddExpense from "./screens/AddExpense";
import Income from "./screens/Income";
import AddIncome from "./screens/AddIncome";
import HomeNav from "./components/HomeNav";
import PaymentScreen from "./screens/PaymentScreen";

const App = () => {
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);

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
        <Route path="/landingpage" element={<LandingPage />} />
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
            token ? <Expenses token={token} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/insights"
          element={
            token ? <Insights token={token} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/income"
          element={token ? <Income token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/addexpense"
          element={
            token ? <AddExpense token={token} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/addincome"
          element={
            token ? <AddIncome token={token} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/payment"
          element={token ? <PaymentScreen /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
