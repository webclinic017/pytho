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
          `Pick a portfolio allocation. Move forward a year at a time and see 
            how that allocation performed over four decades. We include a 60/4
            0 benchmark.`
        }
      </WithMargin>
      <WithMargin>
        {
          `This tool demonstrates the historical variability of returns and t
            he value of geographic diversification.`
        }
      </WithMargin>
      <WithMargin>
        {
          `Our sample is equity and govt bond total returns after inflation fo
            r 16 developed countries in USD terms. Sample periods go from the l
            ate 19th century to the present. In total, there are ~2,000 unique 
            sample periods. Each asset sample will be unique in time and place 
            across the four assets but not unique in place (i.e. you can three 
            samples from the same country).`
        }
      </WithMargin>
      <WithMargin>
        {
          `Our historical returns are overstated. We explain the reasons why o
            n our blog (and provide a full explanation of our methodology). We 
            use the most comprehensive data available but, as with almost every
             analysis of historical returns, this is best-case.`
        }
      </WithMargin>
    </div>
  </Accordion>
);
