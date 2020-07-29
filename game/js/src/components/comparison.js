import React from "react"

/*
        nominal
count 10000.000
mean   2389.654
std    2867.051
min      62.075
25%     854.381
50%    1553.691
75%    2853.483
max   77969.789

*/

export const FortyYearSimExplainer = props => (
  <div>
    <p>{"We ran 10,000 simulations of portfolio outcomes using a " +
       "60/40 allocation (30/30/20/20):"}</p>
    <table style={{textAlign: "right"}}>
      <thead>
        <tr>
          <th>Stat</th>
          <th>Real</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Count</td>
          <td>10,000</td>
        </tr>
        <tr>
          <td>Mean</td>
          <td>2,389.65</td>
        </tr>
        <tr>
          <td>Std</td>
          <td>2,867.05</td>
        </tr>
        <tr>
          <td>Min</td>
          <td>62.08</td>
        </tr>
        <tr>
          <td>25%</td>
          <td>854.38</td>
        </tr>
        <tr>
          <td>50%</td>
          <td>1,553.69</td>
        </tr>
        <tr>
          <td>75%</td>
          <td>2,853.48</td>
        </tr>
        <tr>
          <td>Max</td>
          <td>77,969.79</td>
        </tr>
      </tbody>
    </table>
  </div>
)
