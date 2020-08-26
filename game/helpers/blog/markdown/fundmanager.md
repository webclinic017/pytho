The marginal investor is buying ETFs in overwhelming numbers. They are the default choice for many investors and create their own demand by offering a straightforward, low complexity way to invest money.

But they shouldn't be the only option for investors. Managed funds are a reasonable alternative and can provide a source of idiosyncratic risk that will limit downside risk (unsuprisingly, the growth of ETFs has led to everything becoming correlated).

But how do we know when a portfolio manager is adding value over an ETF?

We can start simply: a portfolio manager adds value when they offer returns that are different to the index underlying their fund. This could be higher returns but could also be lower volatility or some other measure of risk.

We can answer this quantitatively but we can get a very good impression by just looking at the manager's portfolio. How many stocks are in the portfolio? What percentage of the portfolio is in the top ten positions? Funds with hundreds of stocks and a very small fraction of assets in the top ten positions - for example, less than 30% - are unlikely to provide anything above an ETF. This isn't a hard and fast rule. Some funds with hundreds of stocks outperform, and some funds in particular sectors run unconcentrated portfolios by design. Two examples would be: multi-asset or bond funds. Butlooking at the portfolio may give you a useful first impression.

Quantitative tools can be more precise. We can compare the returns of our fund to the returns of the fund benchmark, and measure how exposed our fund is to the risk of our benchmark. If our fund manager is heavily exposed to this "market risk" to the extent that they explain all of the fund's returns, then we should just buy an index fund.

We measure market risk with reference to beta. If the beta of our fund is 1 then our fund will move roughly the same amount as the benchmark. If the benchmark rises 2% one day then our fund will rise that amount, according to our measurement of beta, and we might as well just pay lower fees with the ETF. Note, that this isn't just a measure of correlation - whether the fund and benchmark returns move in the same direction - but volatility: a beta of more than 1 means that our fund moves more than the index, and a beta of less than 1 means that our fund moves less than the index.

To make sense of beta, we have to introduce another concept: alpha, which is that portion of returns that is not explained by the exposure to beta (i.e. market risk). Therefore, alpha is a measurement of how much value a fund manager provides in excess of the market portfolio, it is what you pay the fund manager a fee for.

We measure alpha and beta with linear regression. The nature of this calculation isn't important but we can think of this as an equation with unknowns - beta and alpha - and we calculate those unknowns by comparing the returns of our fund with the fund benchmark.

Beta and alpha were invented many decades ago. And today we can supplement these measures with a few more measures of market risk. For example, we know that companies with certain financial characteristics typically outperform the market. We can create funds based on these measures - commonly called "smart beta" funds - and so we shouldn't reward our fund manager for buying these stocks because we could just replicate these ourselves.

The details of these characteristics are not important but we will be using the "five-factor model" as an additional benchmark for our fund manager. Instead of exposure to market risk, we will be measuring the exposure of our fund manager to each of our five factors. Now, our alpha will represent all the returns in excess not only of the benchmark but of our five factors too.

*Note: we are using the Fama-French 2x3 five-factor model, which means that it is return of, for example, the highest SMB portfolio minus the return of the lowest SMB portfolio. Additionally, FF five-factor doesn't include any momentum factors. Both of these choices were just made for ease of exposition rather than actual correctness, as many possible approachs could be justified.*

So let's see what this looks like by benchmarking the returns of FundSmith against our model:

*We examine the period from the inception of FundSmith until July*

<table>
  <thead>
    <th></th>
    <th>coef</th>
    <th>std err</th>
    <th>P>|t|</th>
  </thead>
  <tbody>
    <tr><td>Mkt-RF</td><td>0.035</td><td>0.017</td><td>0.042</td></tr>
    <tr><td>SMB</td><td>-0.050</td><td>0.033</td><td>0.129</td></tr>
    <tr><td>HML</td><td>0.012</td><td>0.035</td><td>0.724</td></tr>
    <tr><td>RMW</td><td>0.027</td><td>0.052</td><td>0.598</td></tr>
    <tr><td>CMA</td><td>-0.120</td><td>0.068</td><td>0.077</td></tr>
    <tr><td>const</td<td>0.067</td><td>0.017</td><td>0.000</td></tr>
  </tbody>
</table>

This looks more confusing than it actually is. Our first column is just our list of factors and the market portfolio. The MKT is the market portfolio - not 100% accurate in this case as this is the US market and FundSmith holds non-US stocks - and our other five factors which you can google about for more info. 

The second column is our coeffecients, which measure the exposure of FundSmith to each of these factors. For example, our MKT coefficient is the fund beta - 0.03 - which suggests a very low level of exposure to market risk. Note that this is a coefficient, not something that can be interpreted as a percentage. We used daily returns here so to understand what beta contributed to the fund in actual returns, we have to multiply by the actual realised market return in our sample. The average daily market return in our sample was 0.04%.

The next column to draw attention to is the bottom one - const - which is alpha, suggesting that the majority of the fund's returns in this period was alpha: exposure to risks that are unexplained by the market or our five factors. Because this number is a residual - everything that isn't explained by other factors - it is measured in actual returns. The average daily return of Fundsmith during our period was 0.07, so alpha explains substantially all of this return. Also, note the third column: it is beyond scope to explain this in full but this number represents the probability that we are obtaining this number by chance: higher number means a more unreliable estimate of the coefficient value. This number is zero suggesting the number is accurate.

We turn to our five factors. Some of these results are not significant statistically so we should not draw precise conclusions from all of them. But exposure to two factors are worth noting here: SMB and CMA. A full explanation of these factors isn't possible but: SMB represents small-cap stocks, and CMA is a factor relating to the level of investment a firm is making. Both of these factors have underperformed the market over the period in question, and FundSmith shows very low exposure to both factors which has, therefore, turned into a source of excess returns.

This analysis goes further than alpha and beta. We are not only asking about exposure to market risk but exposure to other kinds of risk, and asking far broader questions about how exactly the returns were generated. We can go even further and ditch the market and our five-factor model altogether for a model of industry returns. 

<table>
  <thead>
    <th></th>
    <th>coef</th>
    <th>std err</th>
    <th>P>|t|</th>
  </thead>
  <tbody>
    <tr><td>HiTec</td><td>-0.024</td><td>0.033</td><td>0.467</td></tr>
    <tr><td>NoDur</td><td>0.021</td><td>0.042</td><td>0.616</td></tr>
    <tr><td>Durbl</td><td>0.090</td><td>0.023</td><td>0.000</td></tr>
    <tr><td>Manuf</td><td>0.019</td><td>0.052</td><td>0.714</td></tr>
    <tr><td>Enrgy</td><td>0.020</td><td>0.018</td><td>0.248</td></tr>
    <tr><td>Telcm</td><td>-0.059</td><td>0.033</td><td>0.074</td></tr>
    <tr><td>Shops</td><td>0.049</td><td>0.041</td><td>0.229</td></tr>
    <tr><td>Hlth</td><td>0.028</td><td>0.030</td><td>0.342</td></tr>
    <tr><td>Utils</td><td>0.036</td><td>0.026</td><td>0.169</td></tr>
    <tr><td>Other</td><td>-0.132</td><td>0.041</td><td>0.001</td></tr>
    <tr><td>const</td><td>0.068</td><td>0.017</td><td>0.000</td></tr>
  </tbody>
</table>

Before we go on, it is important to be precise about what is going on here because the notion of regressing on industry returns is actually somewhat controversial. We are not saying anymore: can we just replace FundSmith with an industry index fund? This may actually be a conclusion that is warranted by our analysis but exposure to an industry factor does not necessarily preclude the ability of the fund manager to either move between industries or time moves within that industry: both of these are activities that are possible and worth paying for. The purpose of our analysis here is merely to explain FundSmith's returns.

And the results are not surprising: of the industry factors that we have included the only factor that shows real strength is the consumer durables, which has been a mainstay of FundSmith since inception. The average daily return of durable through our period was 0.044% multiplied by our coefficient of 0.09 is 0.004% which is still a fraction of the total returns of the fund with our const still at 0.07%, representing the bulk of fund returns (again, we would need to include global factors here to increase the strength of this analysis). The other significant factor here is the negative exposure to telecoms. 

Finally, it is worth noting that the five-factor model also has very varying exposure to industry factors. The CMA factor is heavily exposed to manufacturing, telecoms, and energy. The SMB factor is heavily exposed to durables, and manufacturing. Both are, perhaps unsurprisingly given their underperformance, negatively exposed to tech to large degrees. Interestingly though, FundSmith is underweight SMB marginally but is overweight the largest industry factor of SMB: durables. This, presumably, highlights the degree to which FundSmith has been able to generate excess returns in that industry sector. Again though, it is important not to read too much into industry weightings because FundSmith to a large degree is an example of a fund predicated on careful industry allocation.

Over the next few weeks, we will introduce a new feature which allows you to perform this analysis yourself.
