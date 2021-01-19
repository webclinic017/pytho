import React from 'react';
import PropTypes from 'prop-types';

import {
  Text,
} from '@Common';
import {
  Accordion,
} from '@Components/accordion';

const textStyle = {
  padding: '1rem',
};

const WithMargin = (props) => (
  <Text
    margin="0.5rem">
    {props.children}
  </Text>
);

WithMargin.propTypes = {
  children: PropTypes.string.isRequired,
};

export const ExplainFortyYear = (props) => (
  <Accordion
    title={ 'Explain' }>
    <div
      className="pure-u-5-5"
      style={ textStyle }>
      <WithMargin>
        {
          `Pick a portfolio allocation. Move forward a year at a time, change 
          your allocation, and see if you can beat a 60/40 portfolio.`
        }
      </WithMargin>
      <WithMargin>
        {
          `Use this tool to build a sense of historical returns and the
          variability of those returns.`
        }
      </WithMargin>
      <WithMargin>
        {
          `We only include 2 choices within each asset class to highlight the
          variability of returns. The simulation is not intended to re-create
          the total market return of equities so reducing diversification means
          a clear, although exaggerated, picture of variability.`
        }
      </WithMargin>
      <WithMargin>
        {
          `The sample is equity and govt bond total real (after inflation)
          returns for 16 developed countries in USD terms. Sample periods start
          in the late 19th century and end in the present. In all, 2,000+ unique
          samples. Across each simulation, each sample will have a unique time
          and place but one place may be occur more than once. For example, you
          could have a bond sample from France 1960-2000, no other sample will
          use this period and place but you may have an equity sample from 
          France 1940-1980. It is possible, although unlikely, for a simulation 
          to use the same place more than twice.`
        }
      </WithMargin>
      <WithMargin>
        {
          `As with all analysis of historical returns, our returns overstate
          the actual returns to investors. We use the most comprehensive dataset
          that is freely available. The quantum of overstatement is likely
          small. But it is overstated nonetheless. The reasons for this are
          explained in more detail in our blog. Reading this is strongly
          recommended as most studies of historical returns are inevitably
          produced by salespeople who are happy to pretend the data is more
          certain than it actually is.`
        }
      </WithMargin>
    </div>
  </Accordion>
);
