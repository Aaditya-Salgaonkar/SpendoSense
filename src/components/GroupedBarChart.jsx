import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const GroupedBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch logged-in user
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error fetching user:", userError);
        setLoading(false);
        return;
      }
      const currentUserId = userData.user.id;

      // Fetch category names
      const { data: categories, error: categoryError } = await supabase
        .from("categories")
        .select("id, name");

      if (categoryError) {
        console.error("Error fetching categories:", categoryError);
        setLoading(false);
        return;
      }

      // Create a category ID → Name mapping
      const categoryMap = categories.reduce((acc, category) => {
        acc[category.id] = category.name;
        return acc;
      }, {});

      // Fetch planned budgets
      const { data: budgets, error: budgetError } = await supabase
        .from("budgets")
        .select("categoryid, amount")
        .eq("userid", currentUserId);

      if (budgetError) {
        console.error("Error fetching budgets:", budgetError);
        setLoading(false);
        return;
      }

      // Fetch total expenses per category
      const { data: expenses, error: expenseError } = await supabase
        .from("transactions")
        .select("categoryid, amount")
        .eq("userid", currentUserId);

      if (expenseError) {
        console.error("Error fetching expenses:", expenseError);
        setLoading(false);
        return;
      }

      // Aggregate expenses per category
      const expenseMap = expenses.reduce((acc, expense) => {
        acc[expense.categoryid] =
          (acc[expense.categoryid] || 0) + expense.amount;
        return acc;
      }, {});

      // Format data for the chart with category names
      const chartData = budgets.map((budget) => ({
        category:
          categoryMap[budget.categoryid] || `Category ${budget.categoryid}`, // Use name if available
        planned: budget.amount || 0,
        spent: expenseMap[budget.categoryid] || 0,
      }));

      console.log("Chart Data:", chartData); // Debugging

      setData(chartData);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Card className="flex flex-col bg-[#101628] text-white p-4 w-full md:w-2/3 lg:w-1/2 h-[480px] items-center justify-center shadow-lg">
      <CardTitle className="mb-4">Planned vs. Actual Spending</CardTitle>
      <CardContent className="w-full h-full flex justify-center items-center">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap={20} // Ensure proper spacing
              barGap={5}
            >
              <XAxis dataKey="category" tick={{ fill: "white" }} />
              <YAxis tick={{ fill: "white" }} />
              <Tooltip cursor={{ fill: "rgba(255,255,255,0.2)" }} />
              <Legend />
              <Bar
                dataKey="planned"
                fill="#4CAF50"
                name="Planned Budget"
                barSize={40}
              />
              <Bar
                dataKey="spent"
                fill="#F44336"
                name="Amount Spent"
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupedBarChart;
