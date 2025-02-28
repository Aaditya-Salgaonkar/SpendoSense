import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Box, Card, Typography } from "@mui/material";
import { supabase } from "../supabase";
import HomeNav from "../components/HomeNav";
import { motion } from "framer-motion";
import Spinner from "@/components/Spinner";

const categoryIcons = {
  Food: "🍕",
  Travel: "✈️",
  Shopping: "🛍️",
  Bills: "💡",
  Others: "🔹",
};

const ExpensesDashboard = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error("Error getting user:", authError);
        setLoading(false);
        return;
      }

      // Fetch Transactions for Logged-in User
      const { data: transactionsData, error: transactionsError } =
        await supabase
          .from("transactions")
          .select("*")
          .eq("userid", user.id)
          .order("transactiontime", { ascending: false });

      if (transactionsError) {
        console.error("Error fetching transactions:", transactionsError);
        setLoading(false);
        return;
      }

      // Fetch Categories to Map Category IDs
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*");

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
      } else {
        const categoryMap = {};
        categoriesData.forEach((category) => {
          categoryMap[category.id] = category.name;
        });
        setCategories(categoryMap);
      }

      setTransactions(transactionsData);
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <div
        className={` ${
          darkMode ? "bg-[#0a0f1c] text-white" : "bg-gray-100 text-black"
        } flex flex-col items-center p-8`}
      >
        <HomeNav />
      </div>

      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="h5" className="text-center text-gray-300 mb-6">
          Your Transaction History
        </Typography>

        <Link to="/addexpense">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-purple-500  text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 transition-all"
          >
            ➕ Add Transaction
          </motion.button>
        </Link>

        {/* Transactions Table */}
        <Card className="w-[80%] mt-6 bg-[#0a0f1c] shadow-lg rounded-lg p-3 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <Box className="flex justify-center p-6 bg-[#0a0f1c]">
              <Spinner />
            </Box>
          ) : transactions.length > 0 ? (
            <table className="w-full border-collapse ">
              <thead className="sticky top-0 bg-gray-900 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Merchant</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    whileHover={{ scale: 1.02 }}
                    className="border-b border-gray-600 hover:bg-gray-700 bg-[#0a0f1c] transition-all"
                  >
                    <td className="py-4 px-4 text-white">
                      {transaction.merchantName}
                    </td>
                    <td className="py-4 px-4 text-white">
                      {new Date(
                        transaction.transactiontime
                      ).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-white">
                      {categoryIcons[categories[transaction.categoryid]] ||
                        "📌"}{" "}
                      {categories[transaction.categoryid] || "Unknown"}
                    </td>
                    <td className="py-4 px-4 text-right text-green-400">
                      ${transaction.amount.toFixed(2)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Typography color="textSecondary" className="text-center py-6">
              No transactions found.
            </Typography>
          )}
        </Card>
      </Box>
    </div>
  );
};

export default ExpensesDashboard;
