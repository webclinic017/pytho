/*
   Performance for an arbitrary series of returns with no state
   * CAGR
   * Annual volatility
   * Max DD
*/

//private
const round = num => num.toPrecision(4)

export const calculateCAGR = returns => {
  const sum = returns.map(v => 1+v).reduce((acc, curr) => acc*curr, 1)
  return round(
    Math.pow(sum, 1/returns.length) - 1)
}
 
export const calculateVol = returns => { 
  const avg = round(returns.reduce((acc, curr) => acc+curr, 0)/returns.length)
  const squaredsum = round(returns.map(v => Math.pow(v-avg, 2)).reduce((acc, curr) => acc+curr, 0))
  return round(Math.sqrt(squaredsum/returns.length))
}

export const calculateMaxDD = returns => {
  const arbValue = 100
  const path = [arbValue]
  for (let i=0; i < returns.length; i++){
    let periodReturn = 1 + returns[i]
    let newVal = path[i] * periodReturn
    path.push(newVal)
  }

  let maxVal = 0
  let minVal = 0
  let maxDD = 0
  
  for (let i=0; i < path.length; i++){
    let currVal = path[i] 
    if (currVal > maxVal){
      maxVal = currVal
      minVal = maxVal
    } else if (currVal < minVal){
      minVal = currVal
      let tmpDD = (minVal-maxVal)/maxVal
      if (tmpDD < maxDD){
        maxDD = tmpDD
      }
    }
  }
  return round(maxDD)
}
