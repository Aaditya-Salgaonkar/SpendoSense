import React, { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { DashboardRounded, Insights, Wallet, Notifications } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HomeNav from "@/components/HomeNav";

const COLORS = ["#4CAF50", "#FFC107", "#2196F3", "#FF5722"];

const assetData = [
  { name: "Gold", value: 15700 },
  { name: "Stocks", value: 22500 },
  { name: "Warehouse", value: 120000 },
  { name: "Land", value: 135000 },
];

const transactions = [
  { id: 1, type: "Income", amount: 2500, category: "Salary", date: "2024-02-26" },
  { id: 2, type: "Expense", amount: 120, category: "Groceries", date: "2024-02-24" },
  { id: 3, type: "Expense", amount: 70, category: "Transport", date: "2024-02-22" },
  { id: 4, type: "Income", amount: 800, category: "Freelance", date: "2024-02-20" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0a0f1c] text-white" : "bg-gray-100 text-black"} flex`}>
      
      

      {/* Main Content */}
      <div className="flex-1 p-8">
        <HomeNav />
        
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Available Balance", value: "$14,822", color: "text-green-400" },
            { title: "Total Net Worth", value: "$278,378", color: "text-red-300" },
            { title: "Total Spendings", value: "$9,228", color: "text-yellow-300" }
          ].map((item, index) => (
            <motion.div key={index} className="p-6 bg-gray-800 shadow-lg rounded-xl text-center" whileHover={{ scale: 1.05 }}>
              <h2 className={`text-xl font-semibold ${item.color}`}>{item.title}</h2>
              <p className="text-3xl font-bold">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts & Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold text-purple-400">Asset Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {assetData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-orange-400">Income vs Expenses</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={transactions}>
                <XAxis dataKey="category" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-10 bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-yellow-400">Recent Transactions</h2>
          <table className="w-full mt-4">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="p-2">Date</th>
                <th className="p-2">Category</th>
                <th className="p-2">Type</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-gray-700">
                  <td className="p-2">{txn.date}</td>
                  <td className="p-2">{txn.category}</td>
                  <td className={`p-2 ${txn.type === "Income" ? "text-green-400" : "text-red-400"}`}>
                    {txn.type}
                  </td>
                  <td className="p-2">${txn.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notifications */}
        <div className="mt-10 bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-400">Alerts & Notifications</h2>
          <p className="text-lg text-yellow-300">⚠ 3 Bills are past due. Pay soon to avoid late fees.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
