import React, { useState, useEffect } from "react";
import BudgetingCard from "@/components/BudgetingCard";
import UnnecessaryExpenses from "@/components/UnnecessaryExpenses";
import { supabase } from "@/supabase";
import GroupedBarChart from "@/components/GroupedBarChart";
import ExpenseAnalyzer from "@/components/ExpenseAnalyser";
import InvestmentAvenues from "@/components/InvestmentAvenues";

const FinancialAdvice = () => {
  const [balance, setBalance] = useState(null);
  const [userId, setUserId] = useState(null);

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
      }
    };

    fetchBalance(); // ✅ Call the function inside `useEffect`
  }, []); // ✅ Empty dependency array to run once

  return (
    <>
    <div className="flex justify-between bg-[#0a0f1c]"><h1 className="text-4xl text-white bg-[#0a0f1c] font-sans font-bold tracking-tighter px-3 py-2 sm:py-4 sm:px-4 lg:py-4">
        Finance Advisor
      </h1><div className="bg-[#0a0f1c] text-white px-6 py-6">
          <BudgetingCard />
        </div></div>
      
      <h1 className="px-3 py-2 sm:py-4 sm:px-4 lg:py-6 lg:px-4 text-green-500 text-xl font-bold tracking-tighter bg-[#0a0f1c]">
        Your Balance: <span className="font-bold">${balance ?? "Loading..."}</span>
      </h1>
      <div className="min-h-screen flex flex-row justify-between bg-[#0a0f1c] p-10 h-full w-full gap-8">
        {/* Unnecessary Expenses --> Show a pie chart */}
        <UnnecessaryExpenses /> 
        <GroupedBarChart />
    
      </div> 
      <div className="min-h-screen flex flex-row justify-between bg-[#0a0f1c] p-10 h-full w-full gap-8">
     <ExpenseAnalyzer />
     <InvestmentAvenues />

      </div>
      
    </>
  );
};

export default FinancialAdvice;
