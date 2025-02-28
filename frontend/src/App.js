import React, { useState } from "react";
import PaymentForm from "../components/paymentForm";
import PaymentModal from "../components/paymentModal";
import PaymentConfirmation from "../components/paymentConfirmation";
import "./styles.css";

function App() {
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
    <div className="app-container">
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
    </div>
  );
}

export default App;