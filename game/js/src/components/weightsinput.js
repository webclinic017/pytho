import React from "react"

export const WeightsInput = ({ portfolio , onChangeFunc, isFinished }) => {

  const weights = portfolio != null 
    ? portfolio.getWeights()
    : []

  const assetNamesDefault = [
    '  Equity 1', 
    '  Equity 2', 
    '    Bond 1', 
    '    Bond 2']
  
  if (isFinished) {
    return <div />
  } else {
    return (
      <form id="weights-input">
        {weights.map((w, i) => (
          <div key={i}>
            <label style={{ whiteSpace: 'break-spaces'}}>
              {assetNamesDefault[i]} (%):
              <input 
                type="text" 
                aria-label={"weight-input-" + `${i}`}
                name={i} 
                onChange={onChangeFunc} />
            </label>
          </div>
        ))}
      </form>
    )
  }
}
