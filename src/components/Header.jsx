import React from 'react';
import styled from 'styled-components';

// Estilização com Styled Components
const HeaderContainer = styled.header`
  background-color:#1a3961;
  color: white;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const HeaderText = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

const SubHeaderText = styled.p`
  font-size: 0.875rem;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <div>
        <HeaderText>Nelly FinTech</HeaderText>
        <SubHeaderText>Controle financeiro pessoal</SubHeaderText>
      </div>
    </HeaderContainer>
  );
};

export default Header;