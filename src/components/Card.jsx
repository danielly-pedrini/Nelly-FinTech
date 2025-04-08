import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  padding: 1rem;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: ${props => props.$bgColor || '#f5f5f5'};
  color: ${props => props.$textColor || '#333333'};
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
`;

const CardValue = styled.p`
  font-size: 2rem;
  font-weight: bold;
`;

const Card = ({ title, value, bgColor, textColor }) => {
  return (
    <CardContainer $bgColor={bgColor} $textColor={textColor}>
      <CardTitle>{title}</CardTitle>
      <CardValue>{value}</CardValue>
    </CardContainer>
  );
};

export default Card;