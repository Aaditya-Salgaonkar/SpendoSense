import React from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import CreditCardForm from "./creditCardForm";
import PayPalForm from "./payPalForm";
import GooglePayForm from "./googlePayForm";

const PaymentForm = ({
  UPI,
  setUPI,
  merchantName,
  setMerchantName,
  paymentMethod,
  googlePayType,
  handlePaymentChange,
  handleGooglePayTypeChange,
  handleSubmit,
}) => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "400px",
          p: "20px",
          borderRadius: "15px",
          background: "#171c3a",
          boxShadow: "0px 0px 10px rgb(0, 0, 0)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          mb="20px"
          color="white"
          fontWeight={700}
        >
          Payment Gateway
        </Typography>

        <FormControl fullWidth sx={{ mb: "8px" }}>
          <InputLabel
            id="payment-method-label"
            sx={{
              display: "block",
              color: "white",
              "&.Mui-focused": {
                color: "cyan", // Color when focused (selected)
              },
              "&.MuiFormLabel-filled": {
                color: "cyan", // Color when an option is selected
              },
            }}
          >
            Choose Payment Method
          </InputLabel>
          <Select
            labelId="payment-method-label"
            id="paymentMethod"
            value={paymentMethod}
            label="Choose Payment Method"
            onChange={(e) => handlePaymentChange(e.target.value)}
            required
            sx={{
              width: "100%",
              borderRadius: "6px",
              color: "white",
              "&.Mui-focused": {
                color: "cyan", // Color when focused
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white", // Set border color here
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "lightblue", // Border color on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "cyan", // Border color when focused
              },
            }}
          >
            <MenuItem value="creditCard">Credit Card</MenuItem>
            <MenuItem value="paypal">PayPal</MenuItem>
            <MenuItem value="googlePay">Google Pay</MenuItem>
          </Select>
        </FormControl>

        {paymentMethod === "creditCard" && (
          <CreditCardForm
            merchantName={merchantName}
            setMerchantName={setMerchantName}
          />
        )}
        {paymentMethod === "paypal" && (
          <PayPalForm
            UPI={UPI}
            setUPI={setUPI}
            merchantName={merchantName}
            setMerchantName={setMerchantName}
          />
        )}
        {paymentMethod === "googlePay" && (
          <GooglePayForm
            UPI={UPI}
            setUPI={setUPI}
            merchantName={merchantName}
            setMerchantName={setMerchantName}
            googlePayType={googlePayType}
            handleTypeChange={handleGooglePayTypeChange}
          />
        )}

        <Button
          type="submit"
          fullWidth
          sx={{
            width: "100%",
            p: "10px",
            backgroundColor: "rgb(17, 118, 234)",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "600",
            mt: "20px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgb(37, 97, 165)",
            },
          }}
        >
          Proceed to Pay
        </Button>
      </Box>
    </motion.div>
  );
};

export default PaymentForm;
