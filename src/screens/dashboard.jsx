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
import IncomeCard from "@/components/IncomeCard";
import RecentTransactions from "@/components/RecentTransaction";
import IncomeVsExpenses from "@/components/IE";

const COLORS = ["#4CAF50", "#FFC107", "#2196F3", "#FF5722"];

const topStats = [
  { title: "Available Balance", value: "$14,822", color: "text-green-400" },
  { title: "Total Net Worth", value: "$278,378", color: "text-red-300" },
  { title: "Total Spendings", value: "$9,228", color: "text-yellow-300" },
];

// const incomeSourceData = [
//   { name: "E-commerce", value: 2100, color: "#FFFFFF" },
//   { name: "Google Adsense", value: 950, color: "#FF4D4D" },
//   { name: "My Shop", value: 8000, color: "#FFFFFF" },
//   { name: "Salary", value: 13000, color: "#00D084" },
// ];

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

const Dashboard = ({ token }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [users, setUsers] = useState([]);

  const [transactions, setTransactions] = useState([]);

  const [budgets, setBudgets] = useState([]);

  const [analytics, setAnalytics] = useState([]);

  const [financialAdvice, setFinancialAdvice] = useState([]);

  const [categories, setCategories] = useState([]);

  const [spendingBreakdown, setSpendingBreakdown] = useState([]);
  const [incomeSourceDataForGraph, setIncomeSourceDataForGraph] = useState([]);
  const [incomeSourceDataForGraph2, setIncomeSourceDataForGraph2] = useState(
    []
  );

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
        const breakdownData = await Promise.all(
          categoryMap.map(async (category) => {
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

            const totalAmount = data.reduce(
              (sum, txn) => sum + parseFloat(txn.amount),
              0
            );

            const formattedAmount = `$${totalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;

            return {
              ...category,
              amount: formattedAmount,
            };
          })
        );

        setSpendingBreakdown(breakdownData);
      } catch (error) {
        console.error("Error fetching spending breakdown:", error);
      }
    };

    fetchSpendingBreakdown();
  }, []);

  useEffect(() => {
    console.log("Fetching income data...");

    const fetchIncomeData = async () => {
      try {
        const {
          data: { user },
          error: useError,
        } = await supabase.auth._getUser();
        console.log("Fetching income data...");
        const { data, error } = await supabase
          .from("income")
          .select("amount, created_at")
          .eq("userId", user.id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        console.log("Fetched income data:", data);

        const formattedData = data.map((item) => ({
          value: item.amount,
          date: new Date(item.created_at).toLocaleDateString(),
        }));

        console.log("Formatted income data:", formattedData);
        setIncomeSourceDataForGraph(formattedData);
      } catch (err) {
        console.error("Error fetching income data:", err.message);
      }
    };

    const fetchSpendData = async () => {
      try {
        const {
          data: { user },
          error: useError,
        } = await supabase.auth._getUser();
        console.log("Fetching spend data...");
        const { data, error } = await supabase
          .from("transactions")
          .select("amount, transactiontime")
          .eq("userid", user.id)
          .order("transactiontime", { ascending: true });

        if (error) throw error;

        console.log("Fetched spend data:", data);

        const formattedSpendData = data.map((item) => ({
          value: item.amount,
          date: new Date(item.transactiontime).toLocaleDateString(),
        }));

        console.log(
          "---------------------Formatted spend data:",
          formattedSpendData
        );
        setIncomeSourceDataForGraph2(formattedSpendData);
      } catch (err) {
        console.error("Error fetching spend data:", err.message);
      }
    };

    fetchIncomeData();
    fetchSpendData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.from("categories").select("*");

        if (error) {
          console.error("Error fetching categories:", error);

          return;
        }

        if (Array.isArray(data)) {
          setCategories(data);

          setLoading(false);
        } else {
          console.warn("Unexpected data format:", data);

          setCategories([]);
        }
      } catch (err) {
        console.error("Unexpected error fetching categories:", err);
      }
    };

    fetchCategories();
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

        <IncomeCard token={token} />
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
                Income
              </Typography>
              <Typography
                fontSize={24}
                fontWeight={500}
                color="white"
                textAlign="left"
                ml={3}
              >
                ₹
                {incomeSourceDataForGraph
                  .reduce((sum, item) => sum + parseFloat(item.value), 0)
                  .toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Typography>
              <ResponsiveContainer width="100%" height="70%">
                <LineChart data={incomeSourceDataForGraph}>
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
                ₹
                {incomeSourceDataForGraph2
                  .reduce((sum, item) => sum + parseFloat(item.value), 0)
                  .toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Typography>
              <ResponsiveContainer width="100%" height="70%">
                <LineChart data={incomeSourceDataForGraph2}>
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
        <IncomeVsExpenses />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />

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
