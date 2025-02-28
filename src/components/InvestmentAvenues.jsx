import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabase } from "../supabase";

const InvestmentAvenues = () => {
  const [investmentData, setInvestmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          console.error("Error fetching user:", userError);
          setLoading(false);
          return;
        }
        const currentUserId = userData.user.id;
        setUserId(currentUserId);

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

        const categoryMapObject = {};
        categoryData.forEach((category) => {
          categoryMapObject[category.id] = category.name;
        });
        setCategoryMap(categoryMapObject);

        const categoryIds = categoryData.map((category) => category.id);
        const { data: transactionsData, error: transactionsError } = await supabase
          .from("transactions")
          .select("amount, categoryid")
          .eq("userid", currentUserId)
          .in("categoryid", categoryIds);

        if (transactionsError) {
          console.error("Error fetching transactions:", transactionsError);
        } else {
          let totalSum = 0;
          const groupedTransactions = transactionsData.reduce((acc, transaction) => {
            const categoryName = categoryMapObject[transaction.categoryid] || "Other";

            if (!acc[categoryName]) {
              acc[categoryName] = 0;
            }
            acc[categoryName] += transaction.amount;
            totalSum += transaction.amount;

            return acc;
          }, {});

          const years = 10;
          const niftyCAGR = 0.12;
          const fdCAGR = 0.08;

          let data = [];
          for (let year = 1; year <= years; year++) {
            const niftyGrowth = totalSum * Math.pow(1 + niftyCAGR, year);
            const fdGrowth = totalSum * Math.pow(1 + fdCAGR, year);

            data.push({
              year: `Year ${year}`,
              NIFTY_50: Math.round(niftyGrowth),
              Fixed_Deposit: Math.round(fdGrowth),
            });
          }

          setInvestmentData(data);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="bg-gray-900 p-5 rounded-lg shadow-sm shadow-white text-white w-1/2 border border-white  ">
      <h2 className="text-xl font-bold mb-4 text-center">📊 Investment Avenues</h2>

     <div>
      {loading ? (
        <p>Loading...</p>
      ) : investmentData.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <div  className="">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={investmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="NIFTY_50" stroke="#4CAF50" strokeWidth={2} />
            <Line type="monotone" dataKey="Fixed_Deposit" stroke="#FFC107" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        </div>
      )}</div>
    </div>
  );
};

export default InvestmentAvenues;