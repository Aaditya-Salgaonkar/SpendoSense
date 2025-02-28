import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PayPalButton from "./RazorPay";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Clear token
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col items-center p-8">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center bg-gray-900 p-4 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-blue-400">Premium Dashboard</h1>
        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded-lg"
        >
          Logout
        </Button>
      </nav>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-8">
        {/* Card 1 */}
        <motion.div
          className="p-6 bg-gray-800 shadow-lg rounded-xl text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold text-blue-400">Total Users</h2>
          <p className="text-3xl font-bold">1,254</p>
        </motion.div>

        <PayPalButton />

        {/* Card 2 */}
        <motion.div
          className="p-6 bg-gray-800 shadow-lg rounded-xl text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold text-green-400">Revenue</h2>
          <p className="text-3xl font-bold">$5,430</p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          className="p-6 bg-gray-800 shadow-lg rounded-xl text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold text-yellow-400">
            Active Sessions
          </h2>
          <p className="text-3xl font-bold">278</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
