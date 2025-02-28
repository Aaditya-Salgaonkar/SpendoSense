import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import { motion } from "framer-motion";

const fieldStyles = {
  backgroundColor: "#171c3a",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "lightblue" },
    "&.Mui-focused fieldset": { borderColor: "cyan" },
    "& input": { color: "white" }, // Make input text white
    "& input::placeholder": { color: "white" },
  },
  "& .MuiInputLabel-root": {
    color: "gray",
    "&.Mui-focused": { color: "cyan" },
  },
};

const PayPalForm = ({ merchantName, setMerchantName }) => {
  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Typography variant="h6" align="center" color="white" fontWeight={600}>
        PayPal Details
      </Typography>

      <TextField
        fullWidth
        label="Merchant Name"
        placeholder="John Doe"
        variant="outlined"
        required
        value={merchantName}
        onChange={(e) => setMerchantName(e.target.value)}
        sx={fieldStyles}
      />

      <TextField
        fullWidth
        label="PayPal Email"
        placeholder="you@example.com"
        variant="outlined"
        type="email"
        required
        sx={fieldStyles}
      />
    </Box>
  );
};

export default PayPalForm;
