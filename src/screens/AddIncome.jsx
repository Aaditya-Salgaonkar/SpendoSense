import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const AddIncome = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
 
    source: "",
    amount: "",
    created_at: new Date().toISOString().slice(0, 16), // Default to current time
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.source || !formData.amount) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Error fetching user:", authError);
      return;
    }
  
    try {
      // Insert income record into the database, with isincome set to true
      const { data: incomeData, error: incomeError } = await supabase.from("income").insert([
        {
          source: formData.source,
          amount: parseFloat(formData.amount),
          created_at: formData.created_at,
          userId: user.id, // Link this income to the logged-in user
          isincome: true,  // Always true for income
        },
      ]);
  
      if (incomeError) {
        console.error("Error adding income:", incomeError.message);
        alert(`Error adding income: ${incomeError.message}`);
        return;
      }
  
      // Fetch the user's current balance
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("totalbalance")
        .eq("id", user.id)
        .single();
  
      if (userError || !userData) {
        console.error("Error fetching user data:", userError);
        return;
      }
  
      // Calculate the new balance
      const newBalance = userData.totalbalance + parseFloat(formData.amount);
  
      // Update the user's total balance
      const { error: updateError } = await supabase
        .from("users")
        .update({ totalbalance: newBalance })
        .eq("id", user.id);
  
      if (updateError) {
        console.error("Error updating balance:", updateError.message);
        return;
      }
  
      alert("Income added successfully!");
      setFormData({
        source: "",
        amount: "",
        createdAt: new Date().toISOString().slice(0, 16),
      });
  
      navigate(-1); // Navigate back after successful submission
    } catch (err) {
      console.error("Unexpected error:", err);
      alert(`Unexpected error: ${err.message}`);
    }
  };
  
  
  

  return (
    <div className="flex h-screen items-center justify-center p-10 bg-[#0a0f1c]">
      <div className=" p-8 rounded-lg shadow-lg shadow-green-800 bg-opacity-5 w-1/3">
        <h2 className="text-xl bg-gradient-to-r from-green-500 to-black font-semibold mb-4 text-transparent bg-clip-text">
          Add Income
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="ID (Optional)"
            className="p-2 border rounded hover:border-green-400"
          />
          <input
            type="text"
            name="uurid"
            value={formData.uurid}
            onChange={handleChange}
            placeholder="UURID (Optional)"
            className="p-2 border rounded hover:border-green-400"
          /> */}
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="Source of Income"
            className="p-2 border rounded hover:border-green-400"
            required
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
            type="datetime-local"
            name="createdAt"
            value={formData.createdAt}
            onChange={handleChange}
            className="p-2 border rounded hover:border-green-400"
            required
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="p-2 bg-green-800 text-white rounded"
          >
            Submit
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default AddIncome;
