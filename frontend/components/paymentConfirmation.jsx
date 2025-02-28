import React, { useEffect } from "react";

const PaymentConfirmation = ({ amount, paymentMethod }) => {
  return (
    <div className="confirmation-container">
      <p>
        Your payment of ${amount} via {paymentMethod} has been successfully processed.
      </p>
    </div>
  );
};

export default PaymentConfirmation;
