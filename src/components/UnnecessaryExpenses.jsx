import React, { useEffect, useState } from "react";
import { supabase } from "../supabase"; // Ensure correct path
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Spinner from "./Spinner";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0"];

const UnnecessaryExpenses = () => {
  const [transactions, setTransactions] = useState([]);
  const [categoryMap, setCategoryMap] = useState({}); // Stores categoryId → name mapping
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0); // ✅ State for total amount wasted

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
      const unnecessaryCategories = ["Entertainment", "Shopping", "Food","Dining Out"];
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
        let totalSum = 0; // ✅ Variable to store total sum
        const groupedTransactions = transactionsData.reduce((acc, transaction) => {
          const categoryName = categoryMapObject[transaction.categoryid] || "Other";

          if (!acc[categoryName]) {
            acc[categoryName] = 0;
          }
          acc[categoryName] += transaction.amount;
          totalSum += transaction.amount; // ✅ Add to total sum

          return acc;
        }, {});

        // 🔹 Convert grouped data into array format for Recharts
        const formattedChartData = Object.keys(groupedTransactions).map((categoryName) => ({
          name: categoryName,
          value: groupedTransactions[categoryName],
        }));

        setTransactions(formattedChartData); // ✅ Store aggregated transactions
        setTotalAmount(totalSum); // ✅ Store total amount wasted
      }

      setLoading(false);
    };

    fetchUnnecessaryExpenses();
  }, []);

  return (
    <div className="bg-gray-900 p-5 rounded-lg shadow-sm shadow-white text-white h-[480px] w-[640px]">
      <h2 className="text-3xl font-bold  mt-3 px-10 text-center ">Unnecessary Expenses</h2>

      {loading ? (
         <div className="flex-1 items-center justify-center"><Spinner /></div>
      ) : transactions.length === 0 ? (
        <p className="mt-40 justify-center flex">No unnecessary expenses found.</p>
      ) : (
        <div className="flex flex-col justify-center items-center mt-10">
          <PieChart width={250} height={250}>
            <Pie
              data={transactions}
              cx="50%"
              cy="50%"
              outerRadius={60}
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
          </PieChart> 
          {/* ✅ Display Total Amount Wasted */}
          <h2 className="text-xl font-bold mt-4 px-14">Total Amount Wasted: ₹{totalAmount}</h2>
        </div>
      )}
    </div>
  );
};

export default UnnecessaryExpenses;