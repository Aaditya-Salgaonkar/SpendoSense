import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PayPalButton from "./RazorPay";
import Balance from "@/components/balance";
import { Box, Stack, Typography } from "@mui/material";
import { Cell, LineChart, Line } from "recharts";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const data = [
    { name: "E-commerce", value: 2100, color: " #FFFFFF" },
    { name: "Google Adsense", value: 950, color: "#FF4D4D" },
    { name: "My Shop", value: 8000, color: "#FFFFFF" },
    { name: "Salary", value: 13000, color: "#00D084" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Clear token
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col items-center p-8">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center bg-gray-900 p-4 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-blue-400">Premium Dashboard</h1>
        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded-lg"
        >
          Logout
        </Button>
      </nav>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-8xl mt-8 bg-white">
        {/* Card 1 */}
        <Stack
          direction={"column"}
          gap={2}
          sx={{
            height: "100%",
            width: "100%",
          }}
        >
          <motion.div
            style={{
              height: "30%",
              width: "100%",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Stack
              direction={"column"}
              spacing={1}
              pt={2}
              pl={3}
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: "20px",
                background: "linear-gradient(90deg, #FF7F50, #FF4500)",
              }}
            >
              <Typography fontSize={32} fontWeight={600}>
                Total networth
              </Typography>
              <Typography fontSize={32} fontWeight={600}>
                $278,378
              </Typography>
            </Stack>
          </motion.div>

          <motion.div
            style={{
              height: "70%",
              width: "100%",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Box
              sx={{
                height: "100%",
                width: "100%",
                backgroundColor: "#171c3a",
                borderRadius: "20px",
              }}
            >
              <h2 className="text-white text-xl mb-4 ml-5 pt-2">
                Income Source
              </h2>
              <ResponsiveContainer
                width="100%"
                height="90%"
                className="overflow-auto"
                style={{
                  padding: "20px",
                }}
              >
                <BarChart data={data} barSize={50}>
                  <XAxis dataKey="name" stroke="#FFFFFF" fontWeight={600} />
                  <Tooltip />
                  <Bar dataKey="value">
                    <LabelList dataKey="value" position="top" fill="#FFFFFF" />
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </motion.div>
        </Stack>

        {/* Card 2 */}

        {/* <h2 className="text-xl font-semibold text-green-400">Revenue</h2>
          <p className="text-3xl font-bold">$5,430</p> */}
        <Stack
          sx={{
            height: "100%",
            width: "100%",
          }}
          direction={"column"}
          gap={2}
        >
          <motion.div
            style={{
              height: "50%",
              width: "100%",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Stack
              direction={"column"}
              sx={{
                height: "100%",
                width: "100%",
                backgroundColor: "#171c3a",
                borderRadius: "30px",
                padding: 2,
              }}
            >
              <Typography
                fontSize={32}
                fontWeight={600}
                color="white"
                textAlign="left"
                ml={3}
              >
                Spending
              </Typography>
              <Typography
                fontSize={24}
                fontWeight={500}
                color="white"
                textAlign="left"
                ml={3}
              >
                $1,200
              </Typography>
              <ResponsiveContainer width="100%" height="70%">
                <LineChart data={data}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#FF4500"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Stack>
          </motion.div>
          <motion.div
            style={{
              height: "50%",
              width: "100%",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Stack
              direction={"column"}
              sx={{
                height: "100%",
                width: "100%",
                backgroundColor: "#171c3a",
                borderRadius: "30px",
                padding: 2,
              }}
            >
              <Typography
                fontSize={32}
                fontWeight={600}
                color="white"
                textAlign="left"
                ml={3}
              >
                Spending
              </Typography>
              <Typography
                fontSize={24}
                fontWeight={500}
                color="white"
                textAlign="left"
                ml={3}
              >
                $1,200
              </Typography>
              <ResponsiveContainer width="100%" height="70%">
                <LineChart data={data}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#FF4500"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Stack>
          </motion.div>
        </Stack>

        {/* Card 3 */}
        <Stack
          sx={{
            height: "100%",
            width: "100%",
            padding: 1.5,
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "100%",
              backgroundColor: "#171c3a",
              borderRadius: "20px",
            }}
          >
            <Stack
              sx={{
                height: "100%",
                width: "100%",
                backgroundColor: "green",
              }}
              direction={"column"}
            ></Stack>
          </Box>
        </Stack>

        <motion.div
          className="p-6 bg-gray-800 shadow-lg rounded-xl text-center"
          whileHover={{ scale: 1.05 }}
        ></motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
