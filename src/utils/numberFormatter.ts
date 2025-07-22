export const formatNumber = (number: number) => {
  if (number >= 1_00_00_000) {
    return (number / 1_00_00_000).toFixed(2) + " Cr"; // Crore
  } else if (number >= 1_00_000) {
    return (number / 1_00_000).toFixed(2) + " Lakh"; // Lakh
  } else {
    return number?.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};