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

export const ExplainRiskAttr = (props) => (
  <Accordion
    title={ 'Explain' }>
    <div
      style={ textStyle }>
      <WithMargin>
        {`Determine the risk exposure for a fund, etf, equity, or index.`}
      </WithMargin>
      <WithMargin>
        {
          `The dependent variable is the asset whose risk you wish to 
          understand. Independent variables are added one-by-one to 
          explain the performance of our dependent variable.`
        }
      </WithMargin>
      <WithMargin>
        {
          `A simple example explaining the utility of this analysis is 
          analyzing the beta of a fund. We add our fund as dependent variable, 
          we add our benchmark index as the independent variable, and we can 
          then determine precisely whether our fund manager has generated alpha 
          over the index. Note though, the real utility of this method is 
          generalising these concepts: we can add other indexes, we can analyse
          the performance of stocks and see how they move with other indexes. 
          Additionally, note that we offer more analytics into these 
          measurements. Most websites do not offer rolling analysis of 
          coefficients, which is essential as exposures are not constant.`
        }
      </WithMargin>
      <WithMargin>
        {
          `We are using freely available data so there are gaps in our 
          coverage.`
        }
      </WithMargin>
      <WithMargin>
        {
          `Once you run the model, it will take 10-20 seconds to calculate. As
          you add more independent variables, the computation time will 
          increase.`
        }
      </WithMargin>
    </div>
  </Accordion>
);
