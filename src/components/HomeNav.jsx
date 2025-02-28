import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase";
import { Button } from "@/components/ui/button";
import { DashboardRounded, Insights, Wallet } from "@mui/icons-material";

const HomeNav = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0); 

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        fetchBalance(data.user.id); // Fetch balance once user is set
      } else if (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchBalance = async (userId) => {
      const { data, error } = await supabase
        .from("users") 
        .select("totalbalance") 
        .eq("id", userId) 
        .single(); 

      if (error) {
        console.error("Error fetching balance:", error);
      } else {
        setBalance(data?.totalbalance || 0); 
        console.log(data)
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="w-full flex justify-between items-center p-1 shadow-lg rounded-lg pb-8">
      <div>
        <p className="text-gray-400 font-bold text-sm">Automated Expense Tracker</p>
        <p className="text-white font-semibold text-3xl">Available Balance</p>
        <p className="text-[#4A90E2] font-semibold text-4xl">₹ {balance.toLocaleString()}</p>
      </div>

      <div className="flex-row flex gap-3 bg-[#0a0a3e] rounded-lg py-3 px-5">
        <Button className="flex gap-1 bg-[#0d0d51] p-2 rounded-lg" onClick={() => navigate('/dashboard')}>
          <DashboardRounded />
          <p className="text-white font-semibold">Dashboard</p>
        </Button>
        <Button className="flex gap-1 bg-[#0d0d51] p-2 rounded-lg ml-5" onClick={() => navigate('/expenses')}>
          <Wallet />
          <p className="text-white font-semibold">Expenses</p>
        </Button>
        <Button className="flex gap-1 bg-[#0d0d51] p-2 rounded-lg ml-5" onClick={() => navigate('/insights')}>
          <Insights />
          <p className="text-white font-semibold">Insights</p>
        </Button>
      </div>

      <div className="flex items-center gap-5">
        {user ? (
          <>
            <p className="font-semibold">Hi {user?.email} !</p>
            <Button className="bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded-lg ml-5" onClick={handleLogout}>
              <p className="text-sm">Logout</p>
            </Button>
          </>
        ) : (
          <p className="text-white">Loading...</p>
        )}
      </div>
    </nav>
  );
};

export default HomeNav;
