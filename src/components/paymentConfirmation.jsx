import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const PaymentConfirmation = ({ amount, paymentMethod }) => {
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
    </Box>
  );
};

export default PaymentConfirmation;

// Now it has a dark, glowing card effect with a smooth fade-in animation! 🚀 Let me know if you want me to tweak anything!
