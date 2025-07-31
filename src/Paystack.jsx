import React from "react";
import { usePaystackPayment } from "react-paystack";
import { Button } from "@mui/material";

const PayButton = ({ email, amount, name, label = "Pay" }) => {
  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: name,
          variable_name: "name",
          value: name,
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  const handleClick = () => {
    initializePayment(
      () => alert("Payment successful!"),
      () => alert("Payment closed")
    );
  };

  return (
    <Button variant="contained" onClick={handleClick}>
      {label}
    </Button>
  );
};

export default PayButton;
