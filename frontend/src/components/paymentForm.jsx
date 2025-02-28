// PaymentForm.js
import React from "react";
import CreditCardForm from "./creditCardForm";
import PayPalForm from "./payPalForm";
import GooglePayForm from "./googlePayForm";

const PaymentForm = ({
  paymentMethod,
  merchantName,
  setMerchantName,
  googlePayType,
  handlePaymentChange,
  handleGooglePayTypeChange,
  handleSubmit,
}) => {
  return (
    <div className="form-container">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Payment Gateway</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="paymentMethod">Choose Payment Method:</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => handlePaymentChange(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="creditCard">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="googlePay">Google Pay</option>
          </select>
        </div>

        {paymentMethod === "creditCard" && <CreditCardForm merchantName={merchantName} setMerchantName={setMerchantName}/>}
        {paymentMethod === "paypal" && <PayPalForm merchantName={merchantName} setMerchantName={setMerchantName}/>}
        {paymentMethod === "googlePay" && (
          <GooglePayForm
            merchantName={merchantName} 
            setMerchantName={setMerchantName}
            googlePayType={googlePayType}
            handleTypeChange={handleGooglePayTypeChange}
          />
        )}

        <button type="submit" className="submit-button">
          Proceed to Pay
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;