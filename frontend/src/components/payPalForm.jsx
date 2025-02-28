import React from "react";

const PayPalForm = () => (
  <div className="payment-details">
    <h3>PayPal Details</h3>
    <div className="form-group">
      <label htmlFor="merchantName">Merchant Name</label>
      <input type="text" id="merchantName" placeholder="John Doe" required />
    </div>
    <div className="form-group">
      <label htmlFor="paypalEmail">PayPal Email:</label>
      <input
        type="email"
        id="paypalEmail"
        placeholder="you@example.com"
        required
      />
    </div>
  </div>
);

export default PayPalForm;