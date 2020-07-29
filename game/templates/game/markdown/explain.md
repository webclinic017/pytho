## What is this site?

You pick a portfolio in each period. Two assets, two indexes within each asset class. Step through 40 years of returns, and see the final result.

This is intentionally unrealistic.

But will: 

1. Show you the historical variablity of returns
2. Demonstrate the value of geographic diversification
3. Show you what level of returns are realistic, using real data

Our dataset is equity and govt bond total real returns for 16 developed countries in USD terms. USD is selected for ease of calculation, we will eventually offer a wider range of base currencies.

The sample period is 40 years, in most cases these will be consecutive. Samples won't overlap across host and time but the host may not be unique across the sample. In total we have ~2k unique sample periods from the late 19th century to the present.

However, this sample will still overstate historical returns. We cover the reasons for this in full below, but briefly: our sample has selection bias because it is comprised of economies which became developed markets, costs of government policy (for example, capital controls) are not included, and most historical samples overstate the liquidity of markets historically.

## Who is this site for?

Investing is a leap of faith. Your money goes down today and in 40 years, you find out whether you have made a terrible mistake. Very few investors have a realistic perception of historical returns. It is very difficult to make a robust financial plan without realistic information.

The aim of this website is to build familiarity with investing in an environment where errros are costless. Real data. Real results.

## Why did we construct our model this way?

*This is more technical and assumes some familiarity with modelling financial returns.*

Modelling of financial returns takes two approaches: simulated or real data.

#### Simulated Data

Simulated data is used widely in the financial industry. Quantiatively, this is relatively simple and you can generate huge amounts of data that provide confidence in any estimate you draw.

Unfortunately, the majority of this confidencce is misplaced. Financial data is hard to model parametrically. Markets are volatile and strange things happen. As an example, in our sample we have two years (Germany 1923/24) of hyperinflation. Trying to represent parametrically when your model is so sensitive to the occurence of one event in a sample of tens of thousands seems foolish.

In most cases, investors use very simple parametric models which vastly overstate the mean return by orders of magnitude and understate the sensitivity of portfolios to rare events. When you invest over a 40-year period, the probability of running into at least one of these severe situations is very high - over 50%, at least - but zero in your model.

#### Real data

Using real data removes all these pitfalls at the cost of having to deal with a far smaller sample of returns. For our application, this cost is reasonable because we have a sample of annual returns that reflect a large variety of market states across time and place.

Despite this, our model will still tend to overstate returns. Far less so than simulated data but there is still, in all probability, some overstatement of historical returns.

First, we still cannot represent the full spectrum of possible future events by what happened in the past. Things that have never occurred before are not impossible.

Second, investors should not draw conclusions from one sample. Our application is intended to be run lots of times so that investors can see the results across many periods.

Third, inflation is unpredictable. Our sample is optimistic in that we are adjusting for inflation in USD, a currency which has seen lower levels of price inflation than other countries in our sample. The implicit assumption of this choice is that investors will always be able to access some stable form of value but this was not true for some periods in our sample (post WW2 to 1970s).

Fourth, this last point can be generalised: government policy can be disruptive. A list of historical returns cannot represent the context in which those returns were generated. For example, equity returns after WW2 were generally because government policy forced savers into government bonds.

Fifth, our sample is missing years when markets just shut down. European countries shut markets during WW1 and WW2. Our sample doesn't reflect this loss of liquidity. Additionally, for reasons related to data quality, we removed Germany 1923. This doesn't impact our results, by this point the market had already dropped 99.999% but this is still an imperfection of our sample.

Finally, our sample is 16 developed economies based on their definition at the close of the century. We include the levitation of Japan but not the implosion of Russia or Argentina. Perhaps the most important ommission is Austro-Hungary which had a reasonably large and active equity market, and went to zero during our sample period (there is no freely available data for this market).

Some of these effects are unquantifiable. We can't quantify the cost of financial repression after WW2. And our model is always going to overstate historical returns. But we can be aware of that optimism, and use these numbers as a baseline.
