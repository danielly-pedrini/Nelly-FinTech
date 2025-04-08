import React from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 0.375rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: white;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  background-color: ${(props) => props.$primary ? '#1a3961' : '#e2e8f0'};
  color: ${(props) => props.$primary ? 'white' : '#4a5568'};

  &:hover {
    opacity: 0.9;
  }
`;

const TransactionFormComponent = ({ 
  onInputChange, 
  newTransaction, 
  onAddTransaction, 
  isEditing, 
  onCancelEdit 
}) => {
  return (
    <FormContainer>
      <FormGrid>
        <FormGroup>
          <Label htmlFor="nome">Nome</Label>
          <Input 
            type="text" 
            id="nome" 
            name="nome" 
            value={newTransaction.nome} 
            onChange={onInputChange} 
            placeholder="Ex: Aluguel, Salário"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="valor">Valor (R$)</Label>
          <Input 
            type="number" 
            id="valor" 
            name="valor" 
            value={newTransaction.valor} 
            onChange={onInputChange} 
            placeholder="Ex: 1500.00"
            min="0"
            step="0.01"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="tipo">Tipo</Label>
          <Select 
            id="tipo" 
            name="tipo" 
            value={newTransaction.tipo} 
            onChange={onInputChange}
          >
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="data">Data de Registro</Label>
          <Input 
            type="date" 
            id="data" 
            name="data" 
            value={newTransaction.data} 
            onChange={onInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="dataVencimento">Data de {newTransaction.tipo === 'receita' ? 'Recebimento' : 'Pagamento'}</Label>
          <Input 
            type="date" 
            id="dataVencimento" 
            name="dataVencimento" 
            value={newTransaction.dataVencimento} 
            onChange={onInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="status">Status</Label>
          <Select 
            id="status" 
            name="status" 
            value={newTransaction.status} 
            onChange={onInputChange}
          >
            <option value="pendente">Pendente</option>
            {newTransaction.tipo === 'receita' ? (
              <option value="recebido">Recebido</option>
            ) : (
              <option value="pago">Pago</option>
            )}
          </Select>
        </FormGroup>
      </FormGrid>
      
      <CheckboxContainer>
        <Checkbox 
          type="checkbox" 
          id="recorrente" 
          name="recorrente" 
          checked={newTransaction.recorrente} 
          onChange={(e) => onInputChange({ 
            target: { 
              name: 'recorrente', 
              value: e.target.checked 
            } 
          })}
        />
        <Label htmlFor="recorrente" style={{ marginBottom: 0 }}>
          Transação recorrente
        </Label>
      </CheckboxContainer>
      
      <ButtonContainer>
        {isEditing && (
          <Button type="button" onClick={onCancelEdit}>
            Cancelar
          </Button>
        )}
        <Button type="button" $primary onClick={onAddTransaction}>
          {isEditing ? 'Atualizar' : 'Adicionar'} Transação
        </Button>
      </ButtonContainer>
    </FormContainer>
  );
};

export default TransactionFormComponent;