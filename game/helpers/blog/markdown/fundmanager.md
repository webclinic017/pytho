The marginal investor is buying ETFs in overwhelming numbers and overlooking the valuable, uncorrelated risk that manage funds provide. But, for most investors, managed funds feel more risky: how do we know when a portfolio manager is adding value over an ETF?

We can start simply: a portfolio manager adds value when they offer returns that are different to the index underlying their fund. This could be higher returns but could also be lower volatility or some other measure of risk.

We can answer this quantitatively but we can start by looking at the manager's portfolio. How many stocks are in the portfolio? What percentage of the portfolio is in the top ten positions? 

Funds with hundreds of stocks and a very small fraction of assets in the top ten positions - for example, less than 30% - are unlikely to provide anything above an ETF. This isn't a hard and fast rule. Some funds with hundreds of stocks outperform, and some funds run diverse portfolios by design - for example, multi-asset or bond funds - but looking at the portfolio may give you a useful first impression.

Quantitative tools are more precise. We can compare the returns of our fund to the returns of the fund benchmark, and measure how exposed our fund is to the risk of our benchmark. If our fund manager is heavily exposed to this "market risk" to the extent that they explain all of the fund's returns, then we should just buy an index fund.

We describe market risk with beta. We will explain the measurement in detail later but, for now, we will just state that beta of 1 means our fund will move roughly as much as the market, and more/less when beta is greater/less than 1. Note, that this isn't only a measure of correlation but relative volatility: a beta of more than 1 means that returns are correlated to the index and have greater volatility.

And the portion of returns that cannot explained by exposure to market risk is alpha. This is how much value a fund manager provides in excess of the market portfolio. Alpha is why, in theory, you pay fees.

Alpha and beta are measured with linear regression. We can think of this as an equation with some unknowns - alpha and beta - are we calculate those unknowns by comparing the returns of our fund with the benchmark.

``
  fund_returns = alpha + (beta * market_returns)
``

To truly measure fund manager performance, we should go further and define more measures of risk that we shouldn't pay fund managers for. These "smart beta" factors - value, size, and others - can be replicated cheaply so we should also deduct these from performance when calculating our fund manager's alpha.

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
    <tr><td>const</td><td>0.067</td><td>0.017</td><td>0.000</td></tr>
  </tbody>
</table>

This looks more confusing than it actually is. Our first column is just our list of factors and the market portfolio. The MKT is the market portfolio - not 100% accurate in this case as this is the US market and FundSmith holds non-US stocks - and our other five factors are our additional risk factors.

The second column is our coeffecients, which measure the exposure of FundSmith to each of these factors. For example, our MKT coefficient is the fund beta - 0.03 - which suggests a very low level of exposure to market risk. 

This is not a percentage, this is not a return but a coefficient that has to be multiplied by another a number - the return of the benchmark - to get the contribution of the market in terms of % returns. The average daily market return was 0.04% multiplied by our 0.03 beta, so basically no contribution to total returns.

The next column to draw attention to is the bottom one: const, we can think of this as all the returns that weren't attributable to our risk factors: alpha. 

Because this is a residual, and not a coefficient explaining a factor, this is measured in terms of actual returns: Fundsmith's daily returns averaged 0.07% so substantially all of that performance was alpha.

The third column represents the probability of obtaining the coefficient by chance. The full explanation of this is beyond the scope of this article but it is important to understand that our coefficients are just estimates. So we should only really pay attention to coefficients that have a very low probability of occuring by chance. For example, our alpha estimate has a zero percent probability of occuring by chance which suggests it is credible.

If we turn to our five factors, not all of these results are statistically significant but two are worth noting: SMB and CMA. The former is small-cap stocks, the latter is a factor relating to the level of investment companies are making. But the key point is that both of these factors have underperformed significantly in the period, and FundSmith is showing low exposure to these factors.

When we start looking at five factors, we have clearly gone beyond alpha and beta to ask broader questions about how exactly returns were generated. We can use this process to go further, and replace our five-factor model with sector returns.

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

Before we go on, regressing on industry returns is somewhat controversial but we are not saying that we could replace FundSmith with some kind of industry index fund. Our analysis could lead to this conclusion but our fund could move between industries or pick companies within industries. Both of these activies can generate alpha, and are worth paying for. Here, we are simply seeking to explain FundSmith's returns. Equally, it is important to note that industry definitions are somewhat arbitrary.

And the results aren't surprising: consumer durables stand out, and these have been a mainstay of FundSmith. But this exposure only generated a tiny fraction of FundSmith's returns; again, FundSmith owns many non-US stocks. Another significant factor here is the negative exposure to telecoms, which is somewhat significant statistically.

If we look at which of our five factors are exposed to telecoms, we find that CMA is heavily exposed to this industry risk. CMA identifies companies that are investing conservatively, interestingly not a strategy that FundSmith is opposed to. But FundSmith has clearly been able to avoid those companies, like telecoms, within the CMA factor that are destroying capital.

Equally, we can decompose the SMB factor - identifying smaller companies - and we see that this factor is heaviy exposed to durables and manufacturing. FundSmith was exposed to durables too but has clearly demonstrated stock selection ability by outperforming the SMB factor significantly, and even having a negative exposure to that factor.

This analysis is not a recommendation. We have not examined a benchmark that is directly comparable with FundSmith but merely demonstrated the type of analysis that you could perform to benchmark the fund. It is possible to go even further and measure exposure to non-stock market related variables too: for example, we could add GDP growth, and measure how exposed FundSmith's returns are to growth in various countries. But this is left up to the reader to explore further.

Most readers won't perform this analysis regularly but it is worth remembering the ideas behind the analysis. What am I actually paying for? How do I measure value for money? Is the benchmark of this fund realistic? How has the fund performed against the benchmark? Does this fund seem to be more volatile/less volatile? How exposed is the fund to other risks?

And we will introduce a tool over the next few weeks that will make this kind of analysis accessible to users.
