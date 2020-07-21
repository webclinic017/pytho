
const period = (period, max_period) => {
  /*
    Wraps around a period so it can be passed
    by reference to other objects
  */

  let period_c = period
  let max_period_c = max_period

  let state = {
    isValid: () => period_c < max_period_c,
    increment: () => period_c++,
    getPeriod: () => period_c
  }

  return Object.assign(state)
}

export default period
