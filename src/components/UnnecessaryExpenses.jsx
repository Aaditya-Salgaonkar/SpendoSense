import React, { useEffect, useState } from "react";
import { supabase } from "../supabase"; // Ensure correct path
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0"];

const UnnecessaryExpenses = () => {
  const [transactions, setTransactions] = useState([]);
  const [categoryMap, setCategoryMap] = useState({}); // Stores categoryId → name mapping
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUnnecessaryExpenses = async () => {
      setLoading(true);

      // 1️⃣ Get the logged-in user ID
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error fetching user:", userError);
        setLoading(false);
        return;
      }
      const currentUserId = userData.user.id;
      setUserId(currentUserId);

      // 2️⃣ Fetch all unnecessary categories (Entertainment, Shopping, Food, etc.)
      const unnecessaryCategories = ["Entertainment", "Shopping", "Food"];
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id, name")
        .in("name", unnecessaryCategories);

      if (categoryError || !categoryData) {
        console.error("Error fetching categories:", categoryError);
        setLoading(false);
        return;
      }

      // 🔹 Build categoryMap dynamically from database (UUID → category name)
      const categoryMapObject = {};
      categoryData.forEach((category) => {
        categoryMapObject[category.id] = category.name;
      });
      setCategoryMap(categoryMapObject);

      // 3️⃣ Fetch transactions where category_id is in the unnecessary category list
      const categoryIds = categoryData.map((category) => category.id);

      const { data: transactionsData, error: transactionsError } = await supabase
        .from("transactions")
        .select("amount, categoryid")
        .eq("userid", currentUserId)
        .in("categoryid", categoryIds);

      if (transactionsError) {
        console.error("Error fetching transactions:", transactionsError);
      } else {
        // 🔥 Step 4: Aggregate Transactions by Category (Sum Total Amounts)
        const groupedTransactions = transactionsData.reduce((acc, transaction) => {
          const categoryName = categoryMapObject[transaction.categoryid] || "Other";

          if (!acc[categoryName]) {
            acc[categoryName] = 0;
          }
          acc[categoryName] += transaction.amount;

          return acc;
        }, {});

        // 🔹 Convert grouped data into array format for Recharts
        const formattedChartData = Object.keys(groupedTransactions).map((categoryName) => ({
          name: categoryName,
          value: groupedTransactions[categoryName],
        }));

        setTransactions(formattedChartData); // ✅ Store aggregated transactions
      }

      setLoading(false);
    };

    fetchUnnecessaryExpenses();
  }, []);

  return (
    <div className="bg-gray-900 p-5 rounded-lg shadow-sm shadow-white text-white h-1/3">
      <h2 className="text-xl font-bold mb-4 px-14">Unnecessary Expenses</h2>

      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p>No unnecessary expenses found.</p>
      ) : (
        <div className="flex justify-center"><PieChart width={300} height={350} >
          <Pie
            data={transactions}
            cx="50%"
            cy="50%"
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {transactions.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart> </div>
    
        
      )}
    </div>
  );
};

export default UnnecessaryExpenses;
