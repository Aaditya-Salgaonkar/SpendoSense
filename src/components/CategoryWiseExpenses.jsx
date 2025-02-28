import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { supabase } from "../../src/supabase";
import { ThemeProvider, createTheme, Box, Typography } from "@mui/material";

// Dark Mode Theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
});

const COLORS = ["#F72585", "#7209B7", "#560BAD", "#480CA8", "#B5179E"];

const CategoryWiseExpenses = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCategoryWiseExpenses = async () => {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user || authError) {
        console.error("Error while accessing user data", authError);
        return;
      }

      const { data, error } = await supabase
        .from("expenses")
        .select("category, amount")
        .eq("freelancer_id", user.id);

      if (error || !data) {
        console.error("Error fetching expenses or no data found:", error);
        return;
      }

      // Aggregate category-wise expenses
      const categoryMap = data.reduce((acc, { category, amount }) => {
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {});

      setChartData(
        Object.keys(categoryMap).map((category) => ({
          name: category,
          value: categoryMap[category],
        }))
      );
    };

    fetchCategoryWiseExpenses();
  }, [supabase]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 5, m: 2, pt: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Expenses
        </Typography>
        {chartData.length > 0 ? (
          <PieChart width={500} height={500}>
            <Pie data={chartData} cx={250} cy={250} outerRadius={150} dataKey="value" label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <Typography variant="h6" color="text.secondary">
            No expense data available.
          </Typography>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default CategoryWiseExpenses;
