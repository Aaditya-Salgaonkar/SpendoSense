import React, { useState, useEffect } from "react";
import BudgetingCard from "@/components/BudgetingCard";
import UnnecessaryExpenses from "@/components/UnnecessaryExpenses";
import { supabase } from "@/supabase";
import GroupedBarChart from "@/components/GroupedBarChart";
import ExpenseAnalyzer from "@/components/ExpenseAnalyzer";
import InvestmentAvenues from "@/components/InvestmentAvenues";
import HomeNav from "@/components/HomeNav";
import ChatBot from "@/components/ChatBot";
import ChatComponent from "@/components/ChatComponent";
import Spinner from "@/components/Spinner";
const FinancialAdvice = () => {
  const [balance, setBalance] = useState(null);
  const [userId, setUserId] = useState(null);
   const [darkMode, setDarkMode] = useState(true);
const [loading,setLoading]=useState(true);
  useEffect(() => {
    const fetchBalance = async () => {
      // 🔹 1️⃣ Get the current logged-in user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error fetching user:", userError);
        return;
      }
      const currentUserId = userData.user.id;
      setUserId(currentUserId);

      // 🔹 2️⃣ Fetch balance from 'users' table
      const { data, error } = await supabase
        .from("users")
        .select("totalbalance")
        .eq("id", currentUserId)
        .single(); // ✅ Ensure we get only one row

      if (error) {
        console.error("Error fetching balance:", error);
      } else {
        setBalance(data?.totalbalance ?? 0); // ✅ Avoid setting undefined
        setLoading(false)
      }
    };

    fetchBalance(); // ✅ Call the function inside `useEffect`
  }, []); // ✅ Empty dependency array to run once
  

  return (
    <div className={`min-h-screen ${
      darkMode ? "bg-[#0a0f1c] text-white" : "bg-gray-100 text-black"
    } flex flex-col items-center p-8`}>
      <>
      <div className="w-full mt-4">
    <HomeNav />
  </div>
    {
      loading?(<div className="flex-1 items-center justify-center"><Spinner /></div>):(<div><div className="flex justify-between bg-[#0a0f1c]"><h1 className="text-4xl text-white bg-[#0a0f1c] font-sans font-bold tracking-tighter px-3 py-2 sm:py-4 sm:px-4 lg:py-4">
        Finance Advisor
      </h1><div className="bg-[#0a0f1c] text-white px-6 py-6">
          <BudgetingCard />
        </div></div>
      
      <div className=" flex flex-row justify-between bg-[#0a0f1c] p-10 h-full w-full gap-8">
        {/* Unnecessary Expenses --> Show a pie chart */}
        <UnnecessaryExpenses /> 
        <GroupedBarChart />
    
      </div> 
      <div className=" flex flex-row justify-between bg-[#0a0f1c] p-10 h-full w-full gap-8">
     <ExpenseAnalyzer />
     <InvestmentAvenues />
    <ChatBot />
    
      </div>
      <ChatComponent /></div>)
    }
      
    </>
    </div>
  );
};

export default FinancialAdvice;
