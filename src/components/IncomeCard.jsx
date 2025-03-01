import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Stack, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, XAxis, Tooltip, Bar, Cell, LabelList } from "recharts";

const IncomeCard = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [totalNetWorth, setTotalNetWorth] = useState(0);

  useEffect(() => {
    const fetchIncome = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error("Error fetching user:", authError);
        return;
      }

      // Fetch user-specific income data
      const { data: income, error } = await supabase
        .from("income")
        .select("*")
        .eq("userId", user.id);

      if (error) {
        console.error("Error fetching income:", error);
      } else {
        setIncomeData(income);

        // Calculate total net worth from income sources
        const total = income.reduce((sum, entry) => sum + Number(entry.amount), 0);
        setTotalNetWorth(total);
      }
    };

    fetchIncome();
  }, []);

  // Premium gradient colors for bars
  const premiumColors = [
    "#FFD700", // Gold
    "#C0C0C0", // Silver
    "#1E90FF", // Royal Blue
    "#FF5733", // Coral
    "#9C27B0", // Deep Purple
    "#00BFFF", // Sky Blue
    "#FF1493", // Deep Pink
  ];

  return (
    <Stack direction="column" gap={3} sx={{ height: "100%", width: "100%" }}>
      {/* Net Worth Card */}
      <motion.div
        style={{ height: "30%", width: "100%" }}
        whileHover={{ scale: 1.05 }}
      >
        <Stack
          direction="column"
          spacing={1}
          pt={3}
          pl={4}
          sx={{
            height: "100%",
            width: "100%",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #FFD700, #FF4500)",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography fontSize={30} fontWeight={770} color="#171c3a">
            Total Net Worth
          </Typography>
          <Typography fontSize={36} fontWeight={700} color="#fff">
          ₹{totalNetWorth.toLocaleString()}
          </Typography>
        </Stack>
      </motion.div>

      {/* Income Source Bar Chart */}
      <motion.div
        style={{ height: "70%", width: "100%" }}
        whileHover={{ scale: 1.05 }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            backgroundColor: "#171c3a",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography fontSize={30} fontWeight={700}  mb={2}>
            Income Sources
          </Typography>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={incomeData} barSize={40}>
              <XAxis dataKey="source" stroke="#FFFFFF" fontWeight={600} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  color: "#FFD700",
                  borderRadius: "8px",
                }}
                cursor={{ fill: "rgba(255, 215, 0, 0.2)" }}
              />
              <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                <LabelList dataKey="amount" position="top" fill="#FFFFFF" fontSize={16} fontWeight={600} />
                {incomeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={premiumColors[index % premiumColors.length]}
                    style={{
                      transition: "all 0.3s ease-in-out",
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </motion.div>
    </Stack>
  );
};

export default IncomeCard;
