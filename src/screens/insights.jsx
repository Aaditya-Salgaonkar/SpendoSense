import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { DashboardRounded, Insights } from "@mui/icons-material";
import { Wallet } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import HomeNav from "@/components/homeNav";
const COLORS = ["#4CAF50", "#FFC107", "#2196F3", "#FF5722"];

const assetData = [
  { name: "Gold", value: 15700 },
  { name: "Stocks", value: 22500 },
  { name: "Warehouse", value: 120000 },
  { name: "Land", value: 135000 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col items-center p-8">
      <HomeNav />

      <h1>Insights</h1>
    </div>
  );
};

export default Dashboard;
