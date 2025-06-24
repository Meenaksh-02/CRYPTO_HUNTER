import React, { createContext, useContext, useEffect, useState } from "react";

// Create the context
const Crypto = createContext();

// CryptoContext component to provide the context values
const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("INR"); // Default currency
  const [symbol, setSymbol] = useState("₹");

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
    // Add other currencies and symbols if necessary
  }, [currency]);

  return (
    <Crypto.Provider value={{ currency, symbol, setCurrency }}>
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

// Custom hook to access the context
export const CryptoState = () => {
  return useContext(Crypto);
};
