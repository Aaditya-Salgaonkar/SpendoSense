import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Box, Stack, Typography } from "@mui/material";
import { supabase } from "@/supabase";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  LabelList,
  LineChart,
  Line,
} from "recharts";
import HomeNav from "@/components/HomeNav";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";

const COLORS = ["#4CAF50", "#FFC107", "#2196F3", "#FF5722"];

const topStats = [
  { title: "Available Balance", value: "$14,822", color: "text-green-400" },
  { title: "Total Net Worth", value: "$278,378", color: "text-red-300" },
  { title: "Total Spendings", value: "$9,228", color: "text-yellow-300" },
];

const incomeSourceData = [
  { name: "E-commerce", value: 2100, color: "#FFFFFF" },
  { name: "Google Adsense", value: 950, color: "#FF4D4D" },
  { name: "My Shop", value: 8000, color: "#FFFFFF" },
  { name: "Salary", value: 13000, color: "#00D084" },
];

// const spendingBreakdown = [
//   {
//     label: "Housing",
//     amount: "$3,452",
//     icon: <HomeIcon sx={{ color: "white" }} />,
//     iconColor: "#8B5CF6",
//   },
//   {
//     label: "Personal",
//     amount: "$45,581",
//     icon: <PersonIcon sx={{ color: "white" }} />,
//     iconColor: "#EC4899",
//   },
//   {
//     label: "Transportation",
//     amount: "$2,190",
//     icon: <DirectionsCarIcon sx={{ color: "white" }} />,
//     iconColor: "#F97316",
//   },
//   {
//     label: "Family",
//     amount: "$7,190",
//     icon: <PeopleIcon sx={{ color: "white" }} />,
//     iconColor: "rgb(253, 81, 54)",
//   },
// ];

const assetData = [
  { name: "Gold", value: 15700 },
  { name: "Stocks", value: 22500 },
  { name: "Warehouse", value: 120000 },
  { name: "Land", value: 135000 },
];

const transactions = [
  {
    id: 1,
    type: "Income",
    amount: 2500,
    category: "Salary",
    date: "2024-02-26",
  },
  {
    id: 2,
    type: "Expense",
    amount: 120,
    category: "Groceries",
    date: "2024-02-24",
  },
  {
    id: 3,
    type: "Expense",
    amount: 70,
    category: "Transport",
    date: "2024-02-22",
  },
  {
    id: 4,
    type: "Income",
    amount: 800,
    category: "Freelance",
    date: "2024-02-20",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [users, setUsers] = useState([]);

  const [transactions, setTransactions] = useState([]);

  const [budgets, setBudgets] = useState([]);

  const [analytics, setAnalytics] = useState([]);

  const [financialAdvice, setFinancialAdvice] = useState([]);

  const [categories, setCategories] = useState([]);

  const [spendingBreakdown, setSpendingBreakdown] = useState([]);

  const categoryMap = [
    {
      id: "47823c77-f9b8-4387-a76d-54e07c0bf227",
      label: "Dining Out",
      icon: <HomeIcon sx={{ color: "white" }} />,
      iconColor: "#8B5CF6",
    },
    {
      id: "5d98b586-fbb9-4c4b-bed5-ff739eba3ea5",
      label: "Travel",
      icon: <PersonIcon sx={{ color: "white" }} />,
      iconColor: "#EC4899",
    },
    {
      id: "de8d5f42-77c6-4b29-9cdd-6bfc4daf3593",
      label: "Transportation",
      icon: <DirectionsCarIcon sx={{ color: "white" }} />,
      iconColor: "#F97316",
    },
    {
      id: "52c6cc86-78c2-4848-8f4a-ca934fe90ca1",
      label: "Healthcare",
      icon: <PeopleIcon sx={{ color: "white" }} />,
      iconColor: "rgb(253, 81, 54)",
    },
  ];

  useEffect(() => {
    const fetchSpendingBreakdown = async () => {
      try {
        console.log("Fetching spending breakdown...");
        const breakdownData = await Promise.all(
          categoryMap.map(async (category) => {
            console.log(
              `Fetching transactions for category: ${category.label} (ID: ${category.id})`
            );

            const { data, error } = await supabase
              .from("transactions")
              .select("amount")
              .eq("categoryid", category.id);

            if (error) {
              console.error(
                `Error fetching ${category.label} transactions:`,
                error
              );
              return { ...category, amount: "$0.00" };
            }

            console.log(`Fetched transactions for ${category.label}:`, data);

            const totalAmount = data.reduce(
              (sum, txn) => sum + parseFloat(txn.amount),
              0
            );
            console.log(`Total amount for ${category.label}: ${totalAmount}`);

            const formattedAmount = `$${totalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;

            console.log(
              `Formatted amount for ${category.label}: ${formattedAmount}`
            );

            return {
              ...category,
              amount: formattedAmount,
            };
          })
        );

        console.log("Final spending breakdown:", breakdownData);
        setSpendingBreakdown(breakdownData);
      } catch (error) {
        console.error("Error fetching spending breakdown:", error);
      }
    };

    fetchSpendingBreakdown();
  }, []);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#0a0f1c] text-white" : "bg-gray-100 text-black"
      } flex flex-col items-center p-8`}
    >
      {/* Secondary Navigation */}
      <div className="w-full mt-4">
        <HomeNav />
      </div>

      {/* Combined Cards Section */}
      <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Net Worth & Income Source */}
        <Stack
          direction="column"
          gap={2}
          sx={{ height: "100%", width: "100%" }}
        >
          <motion.div
            style={{ height: "30%", width: "100%" }}
            whileHover={{ scale: 1.05 }}
          >
            <Stack
              direction="column"
              spacing={1}
              pt={2}
              pl={3}
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: "20px",
                background: "linear-gradient(90deg, #FF7F50, #FF4500)",
              }}
            >
              <Typography fontSize={32} fontWeight={600}>
                Total Networth
              </Typography>
              <Typography fontSize={32} fontWeight={600}>
                $278,378
              </Typography>
            </Stack>
          </motion.div>
          <motion.div
            style={{ height: "70%", width: "100%" }}
            whileHover={{ scale: 1.05 }}
          >
            <Box
              sx={{
                height: "100%",
                width: "100%",
                backgroundColor: "#171c3a",
                borderRadius: "20px",
              }}
            >
              <h2 className="text-white text-xl mb-4 ml-5 pt-2">
                Income Source
              </h2>
              <ResponsiveContainer
                width="100%"
                height="90%"
                className="overflow-auto"
                style={{ padding: "20px" }}
              >
                <BarChart data={incomeSourceData} barSize={50}>
                  <XAxis dataKey="name" stroke="#FFFFFF" fontWeight={600} />
                  <Tooltip />
                  <Bar dataKey="value">
                    <LabelList dataKey="value" position="top" fill="#FFFFFF" />
                    {incomeSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </motion.div>
        </Stack>

        {/* Card 2: Spending Line Charts */}
        <Stack
          sx={{ height: "100%", width: "100%" }}
          direction="column"
          gap={2}
        >
          <motion.div
            style={{ height: "50%", width: "100%" }}
            whileHover={{ scale: 1.05 }}
          >
            <Stack
              direction="column"
              sx={{
                height: "100%",
                width: "100%",
                backgroundColor: "#171c3a",
                borderRadius: "30px",
                padding: 2,
              }}
            >
              <Typography
                fontSize={32}
                fontWeight={600}
                color="white"
                textAlign="left"
                ml={3}
              >
                Spending
              </Typography>
              <Typography
                fontSize={24}
                fontWeight={500}
                color="white"
                textAlign="left"
                ml={3}
              >
                $1,200
              </Typography>
              <ResponsiveContainer width="100%" height="70%">
                <LineChart data={incomeSourceData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#FF4500"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Stack>
          </motion.div>
          <motion.div
            style={{ height: "50%", width: "100%" }}
            whileHover={{ scale: 1.05 }}
          >
            <Stack
              direction="column"
              sx={{
                height: "100%",
                width: "100%",
                backgroundColor: "#171c3a",
                borderRadius: "30px",
                padding: 2,
              }}
            >
              <Typography
                fontSize={32}
                fontWeight={600}
                color="white"
                textAlign="left"
                ml={3}
              >
                Spending
              </Typography>
              <Typography
                fontSize={24}
                fontWeight={500}
                color="white"
                textAlign="left"
                ml={3}
              >
                $1,200
              </Typography>
              <ResponsiveContainer width="100%" height="70%">
                <LineChart data={incomeSourceData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#FF4500"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Stack>
          </motion.div>
        </Stack>

        {/* Card 3: Spendings Breakdown */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Stack sx={{ height: "100%", width: "100%", padding: 1.5 }}>
            <Box
              sx={{
                height: "100%",
                width: "100%",
                backgroundColor: "#171c3a",
                borderRadius: "20px",
                padding: 4.5,
              }}
            >
              <Typography fontSize={20} fontWeight={600} color="white" mb={2}>
                Spendings
              </Typography>
              <Stack direction="column" spacing={3}>
                {spendingBreakdown.map((item, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    spacing={2}
                  >
                    <Box
                      sx={{
                        height: 50,
                        width: 50,
                        backgroundColor: item.iconColor,
                        borderRadius: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Stack>
                      <Typography fontSize={18} fontWeight={500} color="white">
                        {item.label}
                      </Typography>
                      <Typography fontSize={20} fontWeight={600} color="white">
                        {item.amount}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Stack>
        </motion.div>
      </div>

      {/* Charts & Goals Section */}
      <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asset Distribution PieChart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold text-purple-400">
            Asset Distribution
          </h2>
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
              >
                {assetData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Expenses BarChart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-orange-400">
            Income vs Expenses
          </h2>
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
      <div className="w-full mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-yellow-400">
          Recent Transactions
        </h2>
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
                <td
                  className={`p-2 ${txn.type === "Income" ? "text-green-400" : "text-red-400"}`}
                >
                  {txn.type}
                </td>
                <td className="p-2">${txn.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notifications */}
      <div className="w-full mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-red-400">
          Alerts & Notifications
        </h2>
        <p className="text-lg text-yellow-300">
          ⚠ 3 Bills are past due. Pay soon to avoid late fees.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
