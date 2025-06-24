// src/utils/formatUtils.js

export const numberWithCommas = (x) => {
    let formattedValue = x.toString();
  
    // If the value is greater than a billion
    if (x >= 1e9) {
      formattedValue = (x / 1e9).toFixed(1) + "B"; // Divide by 1 billion and append 'B'
    }
    // If the value is greater than a million
    else if (x >= 1e6) {
      formattedValue = (x / 1e6).toFixed(1) + "M"; // Divide by 1 million and append 'M'
    }
    // For values less than a million, format with commas
    else {
      formattedValue = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  
    return formattedValue;
  };
  