
const period = (period, maxPeriod) => {
  /*
    Wraps around a period so it can be passed
    by reference to other objects
  */

  let periodC = period;
  const maxPeriodC = maxPeriod;

  const state = {
    isValid: () => periodC < maxPeriodC,
    increment: () => periodC++,
    getPeriod: () => periodC,
  };

  return Object.assign(state);
};

export default period;
