export const isWeightValid = (weight, weightPos, weightsCurrent) => {
  // Split validation errors into stages:
  // * We don't know what the type of the input is
  // * We know the type but not whether the update is valid

  // Check type
  if (typeof weight === 'undefined') return false;
  if (isNaN(weight)) return false;

  // Type is correct
  if (weight < 0 || weight > 100) return false;

  const copyOfWeights = [
    ...weightsCurrent,
  ];
  copyOfWeights[weightPos] = weight/100;
  const newWeightsSum = copyOfWeights.reduce((acc, curr) => acc+curr, 0);
  if (newWeightsSum > 1) return false;
  return true;
};
