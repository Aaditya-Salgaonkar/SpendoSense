import React from "react";

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
    <div className="modal-overlay">
      <div className="modal-content">
        {paymentStatus === "" && (
          <>
            <h3>Enter Payment Amount</h3>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <div className="modal-buttons">
              <button onClick={handleConfirmPayment} className="confirm-button">
                Confirm Payment
              </button>
              <button onClick={closeModal} className="cancel-button">
                Cancel
              </button>
            </div>
          </>
        )}
        {paymentStatus === "processing" && <h3>Processing Payment...</h3>}
        {paymentStatus === "confirmed" && (
          <h3 style={{ color: "green" }}>✅ Payment Successful!</h3>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;