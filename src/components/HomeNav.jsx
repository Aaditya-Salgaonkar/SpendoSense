
import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { DashboardRounded, Insights } from "@mui/icons-material";
import { Wallet } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
const homeNav = () => {
    const navigate = useNavigate();
  return (


<nav className="w-full flex justify-between items-center p-1 shadow-lg rounded-lg pb-8">
      <div>
      <p className="text-gray-400 font-bold text-sm">Automated Expense Tracker</p>
      <p className="text-white font-semibold text-3xl">Available Balance</p>
      <p className="text-[#4A90E2] font-semibold text-4xl">₹ 99,05,931</p>
      </div>
      <div className="flex-row flex gap-3 bg-[#0a0a3e] rounded-lg py-3 px-5">
      <Button className="flex-row flex gap-1 bg-[#0d0d51] p-2 rounded-lg" onClick={()=>navigate('/dashboard')}>
      <DashboardRounded />
        <p className="text-white font-semibold">Dashboard</p>
      </Button>
      <Button className="flex-row flex gap-1 bg-[#0d0d51] p-2 rounded-lg ml-5" onClick={()=>navigate('/expenses')}>
      <Wallet />
        <p className="text-white font-semibold">Expenses</p>
      </Button>
      <Button className="flex-row flex gap-1 bg-[#0d0d51] p-2 rounded-lg ml-5" onClick={()=>navigate('/insights')}>
      <Insights />
        <p className="text-white font-semibold">Insights</p>
      </Button>
      </div>
      
        <div className="flex items-center gap-5">
          
          <p className="font-semibold">Aaditya</p>
          <Avatar className="rounded-full">
            <AvatarImage src="https://github.com/Aaditya-Salgaonkar.png" alt="User" className="w-12 h-12 rounded-full" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <Button className="bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded-lg ml-5">
            <p className="text-sm">Logout</p>
          </Button>
        </div>
      </nav>
  )
}

export default homeNav