import React from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const GooglePayForm = ({
  UPI,
  setUPI,
  merchantName,
  setMerchantName,
  googlePayType,
  handleTypeChange,
}) => {
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
        align="center"
        sx={{ color: "white" }}
        fontWeight={600}
      >
        Google Pay Details
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

      <FormControl fullWidth sx={{ mb: "16px" }}>
        <InputLabel
          id="google-pay-type-label"
          sx={{
            display: "block",
            color: "white",
            "&.Mui-focused": {
              color: "cyan", // Color when focused
            },
            "&.MuiFormLabel-filled": {
              color: "cyan", // Color when an option is selected
            },
          }}
        >
          Login Type
        </InputLabel>
        <Select
          labelId="google-pay-type-label"
          id="googlePayType"
          value={googlePayType}
          label="Login Type"
          onChange={(e) => handleTypeChange(e.target.value)}
          required
          sx={{
            width: "100%",
            borderRadius: "6px",
            color: "white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "white", // Default border color
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "lightblue", // Border color on hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "cyan", // Border color on focus
            },
          }}
        >
          <MenuItem value="phone">Phone Number</MenuItem>
          <MenuItem value="id">Google Pay ID</MenuItem>
        </Select>
      </FormControl>

      {googlePayType === "phone" ? (
        <TextField
          fullWidth
          label="Phone Number"
          value={UPI}
          onChange={(e) => setUPI(e.target.value)}
          placeholder="+1 234 567 8900"
          variant="outlined"
          type="tel"
          required
          sx={fieldStyles}
        />
      ) : (
        <TextField
          fullWidth
          label="Google Pay ID"
          value={UPI}
          onChange={(e) => setUPI(e.target.value)}
          placeholder="johndoe@okicici"
          variant="outlined"
          required
          sx={fieldStyles}
        />
      )}
    </Box>
  );
};

export default GooglePayForm;
