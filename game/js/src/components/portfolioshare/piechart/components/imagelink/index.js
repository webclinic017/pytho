import React from 'react';
import PropTypes from 'prop-types';

export const ImageLink = ({
  link,
}) => (
  <div>
    <a
      data-testid="portfolioshare-imagelink"
      href={ link }>
      Chart link
    </a>
  </div>
);

ImageLink.propTypes = {
  link: PropTypes.string.isRequired,
};
