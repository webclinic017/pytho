*This post is technical but it is written with a non-technical reader in mind. Everything in italics is technical addendum.*

Individual investors don't care about volatility, they care about the risk of total loss. What is the risk that the final value of my portfolio is below the amount I need to retire on a certain date? 

Let's take 10,000 samples of a 100% equity portfolio versus 60/40% equity/bond portfolio. We employ the same dataset as used on our website with the same sample methodology: £100 starting value, 40 year sample period, 50/50 equity portfolio, 30/30/20/20 equity/bond portfolio, and all returns after inflation.

<table>
<thead>
<tr><th>     </th><th style="text-align: right;">60/40</th><th style="text-align: right;">equity</th></tr>
</thead>
<tbody>
<tr><td>count</td><td style="text-align: right;">10,000.00</td><td style="text-align: right;">10,000.00</td></tr>
<tr><td>mean</td><td style="text-align: right;">1,202.31</td><td style="text-align: right;">1,732.72</td></tr>
<tr><td>std</td><td style="text-align: right;">1,527.98</td><td style="text-align: right;">3,915.03</td></tr>
<tr><td>min</td><td style="text-align: right;">39.38</td><td style="text-align: right;">3.00</td></tr>
<tr><td>25%</td><td style="text-align: right;">514.58</td><td style="text-align: right;">436.39</td></tr>
<tr><td>50%</td><td style="text-align: right;">847.19</td><td style="text-align: right;">875.14</td></tr>
<tr><td>75%</td><td style="text-align: right;">1,391.14</td><td style="text-align: right;">1,713.15</td></tr>
<tr><td>max</td><td style="text-align: right;">65,290.90</td><td style="text-align: right;">150,223.00</td></tr>
</tbody>
</table>

The results here are unsurprising: 60/40 is less volatile but has a lower probability of a very good outcome. This overstates things slightly - our 60/40 has four country/time pairings against two for the equity portfolio - but the rough picture is correct.

Which portfolio is more likely to suffer a shortfall at retirement? The equity portfolio clearly...but how much more likely? Where is the trade-off? It is unclear. This ambiguity stems from two points. 

One, our real-world loss scenarios don't vary. If our £100 turns into £3, that is total loss. And if our £100 turns into £30, that result isn't 10x better than £3. Below a certain threshold, it makes no difference.

Two, our equity portfolio outcomes are skewed by results that we don't care about. We care more about a good median return than a near zero probability of a max return. Our returns, passed a certain point, provide diminishing value.

Mathematically, we can represent this with a utility function. Below a certain amount - the "required end value" - we gain no utility. Above the required end value, each marginal pound is worth a decreasing amount of utility. If this is unclear, we represent this graphically below.

*Technical explanation: we use a heaviside step function below our critical value (i.e. we just return 0) and a log function above our critical value. Instead of taking ln(wealth) we take ln(wealth/100), we make this modification to increase the derivative because, in reality, most investors are going to value increasing wealth more than implied by a normal log function.* 

![function output](/static/images/002_function_output.png)

The y-axis is our arbitrary unit of utility. The higher the value, the better the outcome. The x-axis is the portfolio value at the end of our simulation. Below our required end value, in this case 100, we get no utility. Above the required end value, we get diminishing returns to additional wealth.

Running our simulation data through this function:

![utility simulation](/static/images/002_utility_simulation.png)

This is the distribution of utility for each portfolio. The x-axis is our arbirary unit of utility: the higher, the better. The y-axis represents probability: the higher, the more likely that outcome. The peaks are the most likely outcome.

At the left side, we have the total loss scenarios where utility is zero and our required end value is below 100. The 60/40 portfolio produced far fewer zero outcomes, and a relatively stable "most likely" outcome. The equity portfolio produced more zero outcomes with far more variance in utility.

Finally, we should ask what the trade-off is here? We used 100 for our required end value but this clearly isn't constant for every investor: some investors don't need to worry about a certain end value, and other investors are very sensitive to that risk.

The chart below answers this question by varying the required end value, and showing what proportion of outcomes resulted in total loss.

![total loss sum](/static/images/002_total_loss_sum.png)

Along the x-axis, we have our required end value inputs. At 100, every outcome below 100 is a total loss. At 200, every outcome below 200 is a total loss. And the y-axis just shows the proportion of simulations that resulted in total loss.

At 100, a required return of 0% over forty years, our equity portfolio has a ~4% of total loss whilst our 60/40 portfolio has a ~0.5% chance of total loss. At 200 - a ~1.7% compounded return over forty years - our chance of total loss with our equity portfolio has more than doubled to ~10% whilst our 60/40 portfolio is ~3%.

*This concept can actually be generalised because our required end value is really just a required return, and a required return is really just a cost of capital in the corporate setting. There is probably an interesting discussion here around the systemic effect of moving shortfall risk from institutions/corporates - i.e. company or pension funds - to individual investors.*

However, we can also highlight a further trade-off. As we extend the x-axis out to 800, which we haven't done here, we find that the blue line actually crosses above the orange line. At this value, a required compounded return of ~5%, the upside risk potential of the equity portfolio bear out, and we find that the risk of total loss of the 60/40 portfolio is actually higher.

###Summary###

Our analysis is not intended to be conclusive proof to the all-equity vs 60/40 debate. Rather we offer a more realistic risk model against which portfolios can be judged, one that considers shortfall risks, and a way to quantify the trade-offs within the framework of that model.

As stated already, we understate the natural diversity of an equity portfolio by comparing it to a 60/40 portfolio with four sources of time/place diversity instead of two. In addition, we have supposed that investors do not vary their strategy over time (i.e. change allocation closer to retirement) which is unrealistic.

However, what this analysis does show is the cost of volatility. Most investors dramatically overpay for volatility. If you are constrained by downside risk, this is usually a trade-off that makes no sense. The probability of a marginally better outcome increases by a few percent, and your probability of total loss multiplies.

We have not sought to demonstrate the value of any particular allocation. This will clearly vary for each investor. But we do highlight that even marginally higher volatility across a relatively tame sample dramatically increases tail risks.
