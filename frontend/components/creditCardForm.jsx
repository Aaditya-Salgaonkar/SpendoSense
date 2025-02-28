import React from "react";

const creditCardForm = ({ merchantName, setMerchantName }) => (
  <div className="payment-details">
    <h3>Credit Card Details</h3>
    <div className="form-group">
      <label htmlFor="merchantName">Merchant Name</label>
      <input type="text" id="merchantName" placeholder="John Doe" required />
    </div>
    <div className="form-group">
      <label htmlFor="cardNumber">Card Number:</label>
      <input
        type="text"
        id="cardNumber"
        placeholder="1234 5678 9012 3456"
        pattern="\d{16}"
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="expiry">Expiry Date:</label>
      <input
        type="text"
        id="expiry"
        placeholder="MM/YY"
        pattern="\d{2}/\d{2}"
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="cvv">CVV:</label>
      <input type="text" id="cvv" placeholder="123" pattern="\d{3}" required />
    </div>
  </div>
);

export default creditCardForm;