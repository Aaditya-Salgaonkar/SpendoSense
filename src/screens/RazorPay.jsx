import React, { useEffect } from "react";

const PayPalButton = () => {
  useEffect(() => {
    // Dynamically load PayPal Buttons after script is loaded
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AdnAJkaVvFHxFYkCuG_6FzAC0T5LmfaQl1TJ2r4_SombfW0UHN8r-TOnxcXn-tiLmH_tNLW8yafNZ46N&components=buttons";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Render the PayPal button once the script is loaded
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            // Set up the transaction details, like amount, currency, etc.
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "100.00", // Amount in USD
                  },
                },
              ],
            });
          },

          onApprove: (data, actions) => {
            // Once the user approves the payment, capture it
            return actions.order.capture().then(function (details) {
              alert("Payment Successful! " + details.payer.name.given_name);
              // Handle the payment success here (e.g., show success message)
            });
          },

          onError: (err) => {
            // Handle any errors during the payment process
            console.error("Error during PayPal payment", err);
            alert("An error occurred while processing the payment.");
          },
        })
        .render("#paypal-button-container"); // Render PayPal button in the div with this ID
    };
  }, []);

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
