import React from "react"

/*
        nominal
count 10000.000
mean    357.851
std     245.793
min       6.364
25%     190.068
50%     306.178
75%     464.984
max    3741.614
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
          <td>357.85</td>
        </tr>
        <tr>
          <td>Std</td>
          <td>245.79</td>
        </tr>
        <tr>
          <td>Min</td>
          <td>6.36</td>
        </tr>
        <tr>
          <td>25%</td>
          <td>190.97</td>
        </tr>
        <tr>
          <td>50%</td>
          <td>306.18</td>
        </tr>
        <tr>
          <td>75%</td>
          <td>464.98</td>
        </tr>
        <tr>
          <td>Max</td>
          <td>3,741.61</td>
        </tr>
      </tbody>
    </table>
  </div>
)
