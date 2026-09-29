import React, { useState } from 'react';

const StarRating = ({ value, onChange, readonly = false }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (index) => {
    if (!readonly && onChange) {
      onChange(index);
    }
  };

  const handleMouseEnter = (index) => {
    if (!readonly) {
      setHoverValue(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = index <= (hoverValue || value);
        return (
          <span
            key={index}
            className={`star ${isFilled ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {isFilled ? '★' : '☆'}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
