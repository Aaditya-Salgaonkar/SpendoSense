import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PaymentConfirmation = ({ amount, paymentMethod }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        mt: 4,
        p: 3,
        borderRadius: "8px",
        backgroundColor: "#171c3a",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        color: "white",
      }}
    >
      <Typography variant="h5" fontWeight={600} color="#4A90E2" gutterBottom>
        Payment Successful
      </Typography>
      <Typography variant="body1">
        Your payment of <strong>${amount}</strong> via{" "}
        <strong>{paymentMethod}</strong> has been successfully processed.
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }} color="#B0BEC5">
        Redirecting to dashboard in 8 seconds...
      </Typography>
    </Box>
  );
};

export default PaymentConfirmation;
