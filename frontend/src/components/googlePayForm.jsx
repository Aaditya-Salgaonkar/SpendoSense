import React from "react";

const GooglePayForm = ({ merchantName, setMerchantName, googlePayType, handleTypeChange }) => (
  <div className="payment-details">
    <h3>Google Pay Details</h3>
    <div className="form-group">
      <label htmlFor="merchantName">Merchant Name</label>
      <input type="text" id="merchantName" placeholder="John Doe" required />
    </div>
    <div className="form-group">
      <label htmlFor="googlePayType">Login Type:</label>
      <select
        id="googlePayType"
        value={googlePayType}
        onChange={(e) => handleTypeChange(e.target.value)}
      >
        <option value="phone">Phone Number</option>
        <option value="id">Google Pay ID</option>
      </select>
    </div>
    {googlePayType === "phone" ? (
      <div className="form-group">
        <label htmlFor="googlePayPhone">Phone Number:</label>
        <input
          type="tel"
          id="googlePayPhone"
          placeholder="+1 234 567 8900"
          required
        />
      </div>
    ) : (
      <div className="form-group">
        <label htmlFor="googlePayId">Google Pay ID:</label>
        <input
          type="text"
          id="googlePayId"
          placeholder="johndoe@okicici"
          required
        />
      </div>
    )}
  </div>
);

export default GooglePayForm;