## What is this site?

You pick a portfolio in each period. Two assets, two indexes within each asset class. Step through 40 years of returns, and see the final result.

This is intentionally unrealistic.

But will: 

1. Show you the historical variablity of returns
2. Demonstrate the value of geographic diversification
3. Show you what level of returns are realistic, using real data

Our dataset is equity and govt bond total real returns for 16 developed countries (using inflation in the host country). 

40 year periods are largely consecutive for a single country. Samples won't overlap in place and time across assets but the place may not be unique. In total, there are ~1.5k unique sample periods stretching from the late 19th century to the present.

Our sample will overstate historical returns marginally. We cover the reasons for this below as they are not simple.

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

Third, inflation is unpredictable. We made the choice to adjust all nominal returns by inflation in the host country: the Belgian govt bond total return - Belgian inflation. This seems the logical approach, it is the return that investors can expect assuming they can convert into some stable form of value. But this assumption has clearly not always applied. When high levels of inflation occur, even in the recent history of developed markets, then there may be some effect on liquidity.

Fourth, this last point can be generalised: government policy is not stable and is often overlooked. Markets can and do shutdown totally, our sample doesn't reflect this cost because we removed these years from our sample. Equally, until relatively recently, many economies had limitations on the convertibilty of capital and the ways in which investors could allocate their assets. As an example, after the Second World War most countries forced private savings into govt bonds. Our sample implies this was costless.

Finally, our sample is 16 developed economies based on their definition at the close of the century. We include the levitation of Japan but not the implosion of Russia or Argentina.

Some of these effects are unquantifiable. We can't really quantify the cost of WW2 to investor's returns, although it is certainly true that equity returns after this period were boosted by the low ownership of equities due to financial repression. But the aim of this model is to demonstrate that low probability events have happened before. We cannot know what will happen in the future but we can recognise that we need to adopt an approach that is robust to low probability events.
