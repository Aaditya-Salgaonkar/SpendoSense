import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data: incomeData, error: incomeError } = await supabase
          .from("income")
          .select("id, created_at, source, amount")
          .order("created_at", { ascending: false });

        if (incomeError) throw incomeError;

        const { data: expenseData, error: expenseError } = await supabase
          .from("transactions")
          .select("id, transactiontime, categoryid, amount")
          .order("transactiontime", { ascending: false });

        if (expenseError) throw expenseError;

        const categoryIds = [
          ...new Set(expenseData.map((txn) => txn.categoryid)),
        ];
        const { data: categories, error: categoryError } = await supabase
          .from("categories")
          .select("id, name")
          .in("id", categoryIds);

        if (categoryError) throw categoryError;

        const categoryMap = categories.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});

        const combinedTransactions = [
          ...incomeData.map((txn) => ({
            ...txn,
            type: "Income",
            amount: txn.amount,
            created_at: txn.created_at,
            category: txn.source,
          })),
          ...expenseData.map((txn) => ({
            ...txn,
            type: "Expense",
            amount: txn.amount,
            created_at: txn.transactiontime,
            category: categoryMap[txn.categoryid] || "Unknown",
          })),
        ]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 8); // Keep only the most recent 8 transactions

        setTransactions(combinedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="w-full mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-yellow-400">
        Recent Transactions
      </h2>
      <table className="w-full mt-4">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="p-2">Date</th>
            <th className="p-2">Category/ Source</th>
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <tr key={txn.id} className="border-b border-gray-700">
                <td className="p-2">
                  {new Date(txn.created_at).toLocaleDateString()}
                </td>
                <td className="p-2">{txn.category || "N/A"}</td>
                <td
                  className={`p-2 ${
                    txn.type === "Income" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {txn.type}
                </td>
                <td className="p-2">₹{txn.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-2 text-center text-gray-400">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;
