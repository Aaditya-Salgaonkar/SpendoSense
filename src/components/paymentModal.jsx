import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { motion } from "framer-motion";

const PaymentModal = ({
  show,
  amount,
  paymentStatus,
  setAmount,
  handleConfirmPayment,
  closeModal,
}) => {
  if (!show) return null;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#171c3a",
          color: "white",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        {paymentStatus === "" && (
          <>
            <Typography variant="h6" fontWeight={600} color="cyan">
              Enter Payment Amount
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              variant="outlined"
              sx={{
                mt: 2,
                backgroundColor: "#0e1330",
                input: { color: "white" },
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "lightblue" },
                  "&.Mui-focused fieldset": { borderColor: "cyan" },
                  "& input::placeholder": { color: "gray" },
                },
              }}
            />
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Button
                onClick={handleConfirmPayment}
                variant="contained"
                sx={{
                  backgroundColor: "cyan",
                  color: "#171c3a",
                  "&:hover": { backgroundColor: "#00bcd4" },
                }}
              >
                Confirm
              </Button>
              <Button
                onClick={closeModal}
                variant="outlined"
                sx={{
                  borderColor: "red",
                  color: "red",
                  "&:hover": { backgroundColor: "#ff1744", color: "white" },
                }}
              >
                Cancel
              </Button>
            </Box>
          </>
        )}
        {paymentStatus === "processing" && (
          <Typography variant="h6" color="cyan">
            Processing Payment...
          </Typography>
        )}
        {paymentStatus === "confirmed" && (
          <Typography variant="h6" color="green">
            ✅ Payment Successful!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PaymentModal;
