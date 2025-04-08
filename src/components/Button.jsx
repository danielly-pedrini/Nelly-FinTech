import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: ${props => props.$bgColor || '#1a3961'};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.$hoverColor || '#1a3961'};
  }
`;

const Button = ({ children, onClick, bgColor, hoverColor, ...props }) => {
  return (
    <StyledButton 
      onClick={onClick} 
      $bgColor={bgColor} 
      $hoverColor={hoverColor}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;