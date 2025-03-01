import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const AddTransaction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    upiid: "",
    amount: "",
    merchantName: "",
    categoryid: "",
    transactiontime: new Date().toISOString().slice(0, 16), // Default to current time
    isincome: false, // Add this new field
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("id, name");
      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleIncomeExpense = () => {
    setFormData({ ...formData, isincome: !formData.isincome });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.merchantName || !formData.categoryid) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Error fetching user:", authError);
      return;
    }
  
    try {
      // Insert transaction as an expense (isincome: false)
      const { data, error: transactionError } = await supabase.from("transactions").insert([
        {
          userid: user.id,
          upiid: formData.upiid,
          amount: parseFloat(formData.amount),
          merchantName: formData.merchantName,
          categoryid: formData.categoryid,
          transactiontime: formData.transactiontime,
          isincome: false, // Setting to false for expenses
        },
      ]);
      console.log('transaction data:', data);
      if (transactionError) {
        console.error("Error adding transaction:", transactionError);
        return;
      }
  
      // Deduct from user's balance
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("totalbalance")
        .eq("id", user.id)
        .single();
  
      if (userError) {
        console.error("Error fetching user balance:", userError);
        return;
      }
  
      const newBalance = parseFloat(userData.totalbalance) - parseFloat(formData.amount);
  
      // Update user's balance
      const { error: updateBalanceError } = await supabase
        .from("users")
        .update({ totalbalance: newBalance })
        .eq("id", user.id);
  
      if (updateBalanceError) {
        console.error("Error updating user balance:", updateBalanceError);
        return;
      }
  
      // Fetch current total spent from analytics
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
  
      const { data: analyticsData, error: analyticsError } = await supabase
        .from("analytics")
        .select("totalspent")
        .eq("userid", user.id)
        .eq("month", currentMonth)
        .eq("year", currentYear)
        .single();
  
      let newTotalSpent = parseFloat(formData.amount);
      if (analyticsData) {
        newTotalSpent += analyticsData.totalspent || 0;
      }
  
      if (analyticsError && analyticsError.code !== "PGRST116") {
        console.error("Error fetching analytics data:", analyticsError);
        return;
      }
  
      // Update analytics table
      if (analyticsData) {
        await supabase
          .from("analytics")
          .update({ totalspent: newTotalSpent })
          .eq("userid", user.id)
          .eq("month", currentMonth)
          .eq("year", currentYear);
      } else {
        await supabase.from("analytics").insert([
          {
            userid: user.id,
            month: currentMonth,
            year: currentYear,
            totalspent: newTotalSpent,
            topcategory: formData.categoryid,
            savings: 0, // Assuming savings calculation is separate
          },
        ]);
      }
  
      alert("Expense added and balance updated successfully!");
      setFormData({
        upiid: "",
        amount: "",
        merchantName: "",
        categoryid: "",
        transactiontime: new Date().toISOString().slice(0, 16),
        status: "Completed",
      });
  
      navigate(-1);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };
  

  return (
    <div className="flex h-screen items-center justify-center p-10 bg-[#0a0f1c]">
      <div className="p-8 rounded-lg shadow-lg shadow-blue-800 bg-opacity-5 w-1/3">
        <h2 className="text-xl bg-gradient-to-r from-blue-500 to-black font-semibold mb-4 text-transparent bg-clip-text">
          Add Expense
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="upiid"
            value={formData.upiid}
            onChange={handleChange}
            placeholder="UPI ID (Optional)"
            className="p-2 border rounded hover:border-green-400"
          />
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="p-2 border rounded hover:border-green-400"
            required
          />
          <input
            type="text"
            name="merchantName"
            value={formData.merchantName}
            onChange={handleChange}
            placeholder="Merchant Name"
            className="p-2 border rounded hover:border-green-400"
            required
          />
          <input
            type="datetime-local"
            name="transactiontime"
            value={formData.transactiontime}
            onChange={handleChange}
            className="p-2 border rounded hover:border-green-400"
            required
          />
          <select
            name="categoryid"
            value={formData.categoryid}
            onChange={handleChange}
            className="p-2 border rounded hover:border-green-400"
            required
          >
            <option value="" disabled>Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

         

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-blue-800 text-white rounded"
          >
            Submit
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
