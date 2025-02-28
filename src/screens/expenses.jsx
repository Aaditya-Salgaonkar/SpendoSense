import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeNav from "@/components/homeNav";
const COLORS = ["#4CAF50", "#FFC107", "#2196F3", "#FF5722"];
import PaymentForm from "../components/paymentForm";
import PaymentModal from "../components/paymentModal";
import PaymentConfirmation from "../components/paymentConfirmation";
import "./styles.css";
import { Box } from "@mui/material";

const assetData = [
  { name: "Gold", value: 15700 },
  { name: "Stocks", value: 22500 },
  { name: "Warehouse", value: 120000 },
  { name: "Land", value: 135000 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const [merchantName, setMerchantName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [googlePayType, setGooglePayType] = useState("phone");
  const [modal, showModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  const handleGooglePayTypeChange = (type) => {
    setGooglePayType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showModal(true);
  };

  const closeModal = () => {
    showModal(false);
    setPaymentStatus("");
  };

  const handleConfirmPayment = () => {
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("confirmed");
      setTimeout(() => {
        setPaymentComplete(true);
        showModal(false);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col items-center p-8">
      <HomeNav />
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {paymentComplete ? (
          <PaymentConfirmation amount={amount} paymentMethod={paymentMethod} />
        ) : (
          <>
            <PaymentForm
              paymentMethod={paymentMethod}
              merchantName={merchantName}
              setMerchantName={setMerchantName}
              googlePayType={googlePayType}
              handlePaymentChange={handlePaymentChange}
              handleGooglePayTypeChange={handleGooglePayTypeChange}
              handleSubmit={handleSubmit}
            />
            <PaymentModal
              show={modal}
              merchantName={merchantName}
              setMerchantName={setMerchantName}
              amount={amount}
              paymentStatus={paymentStatus}
              setAmount={setAmount}
              handleConfirmPayment={handleConfirmPayment}
              closeModal={closeModal}
            />
          </>
        )}
      </Box>
    </div>
  );
};

export default Dashboard;
