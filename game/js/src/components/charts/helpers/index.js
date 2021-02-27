export const returnCalculator = (data) => {
  const result = (data[data.length - 1].close / data[0].close) - 1;
  return parseFloat(result*100).toFixed(2);
};
