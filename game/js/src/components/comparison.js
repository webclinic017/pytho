import React from "react"

/*
           real
count 10000.000
mean   1195.551
std    1377.029
min      38.570
25%     511.660
50%     835.849
75%    1372.775
max   40154.308
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
          <td>1,195.55</td>
        </tr>
        <tr>
          <td>Std</td>
          <td>1,377.03</td>
        </tr>
        <tr>
          <td>Min</td>
          <td>38.57</td>
        </tr>
        <tr>
          <td>25%</td>
          <td>511.66</td>
        </tr>
        <tr>
          <td>50%</td>
          <td>835.85</td>
        </tr>
        <tr>
          <td>75%</td>
          <td>1,372.78</td>
        </tr>
        <tr>
          <td>Max</td>
          <td>40,154.31</td>
        </tr>
      </tbody>
    </table>
  </div>
)
