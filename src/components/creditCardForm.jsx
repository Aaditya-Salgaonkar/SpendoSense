import React from "react";
import { Box, Typography, TextField } from "@mui/material";

const fieldStyles = {
  backgroundColor: "#171c3a",
  color: "white",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    color: "white", // Text color when typing
    "& fieldset": {
      borderColor: "white", // Default border color
    },
    "&:hover fieldset": {
      borderColor: "lightblue", // Border color on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "cyan", // Border color on focus
    },
    "& input::placeholder": {
      color: "white", // Placeholder color
    },
  },
  "& .MuiInputLabel-root": {
    color: "gray", // Default label color
    "&.Mui-focused": {
      color: "cyan", // Label color on focus
    },
  },
};

const CreditCardForm = ({ merchantName, setMerchantName }) => {
  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Typography
        variant="h6"
        sx={{ textAlign: "center", mb: "8px", color: "white" }}
        fontWeight={600}
      >
        Credit Card Details
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
        label="Card Number"
        placeholder="1234 5678 9012 3456"
        variant="outlined"
        inputProps={{ pattern: "\\d{16}" }}
        required
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="Expiry Date"
        placeholder="MM/YY"
        variant="outlined"
        inputProps={{ pattern: "\\d{2}/\\d{2}" }}
        required
        sx={fieldStyles}
      />
      <TextField
        fullWidth
        label="CVV"
        placeholder="123"
        variant="outlined"
        inputProps={{ pattern: "\\d{3}" }}
        required
        sx={fieldStyles}
      />
    </Box>
  );
};

export default CreditCardForm;
