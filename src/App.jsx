import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Card from './components/Card';
import TransactionFormComponent from './components/TransactionForm';
import FinancialCharts from './components/FinancialCharts';
import { formatarMoeda, calcularSaldos } from './utils/helpers';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  margin: 2rem 0 1rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
`;

const TransactionsContainer = styled.div`
  margin-top: 2rem;
`;

const TransactionList = styled.div`
  margin-top: 1rem;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${props => props.$vencida ? '#fff8e8' : 'white'};
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: ${props => props.$vencida ? '4px solid #ff9800' : 'none'};
`;

// Informações da transação
const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

// Data da transação
const TransactionDate = styled.span`
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.25rem;
`;

// Data de vencimento
const DueDate = styled.span`
  font-size: 0.8rem;
  color: ${props => props.$vencida ? '#e74c3c' : '#718096'};
  margin-top: 0.25rem;
  font-weight: ${props => props.$vencida ? 'bold' : 'normal'};
`;

// Ações da transação
const TransactionActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// Valor da transação
const TransactionValue = styled.span`
  font-weight: bold;
  color: ${props => props.$tipo === 'receita' ? '#2ecc71' : '#e74c3c'};
`;

// Status da transação
const TransactionStatus = styled.span`
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: ${props => {
    if (props.$status === 'recebido') return '#2ecc71';
    if (props.$status === 'pago') return '#003785';
    if (props.$vencida) return '#e74c3c';
    return '#f39c12'; // cor para pendente
  }};
  color: white;
  margin-top: 0.25rem;
  display: inline-block;
  width: fit-content;
`;

// Dropdown de opções
const OptionsDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const OptionsButton = styled.button`
  background-color: #f1f1f1;
  border: none;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  
  &:hover {
    background-color: #e1e1e1;
  }
`;

const DropdownContent = styled.div`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: absolute;
  right: 0;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 0.375rem;
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

// Componente de notificações
const NotificationsContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const NotificationBadge = styled.div`
  display: inline-block;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  margin-left: 0.5rem;
`;

const NotificationItem = styled.div`
  padding: 1rem;
  background-color: ${props => props.$type === 'vencida' ? '#fff8e8' : '#e8f4fd'};
  border-left: 4px solid ${props => props.$type === 'vencida' ? '#e74c3c' : '#3498db'};
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const NotificationsToggle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

const App = () => {
  // Estado para armazenar todas as transações
  const [transactions, setTransactions] = useState([]);
  
  // Estado para armazenar a transação que está sendo criada/editada
  const [newTransaction, setNewTransaction] = useState({
    nome: '',
    valor: '',
    tipo: 'despesa',
    data: '',
    dataVencimento: '', // Adicionando data de vencimento
    recorrente: false,
    status: 'pendente'
  });
  
  // Estado para controlar se estamos editando uma transação existente
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estado para controlar dropdowns abertos
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  // Estado para controlar visualização de notificações
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Carregar transações do localStorage quando o componente montar
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error('Erro ao carregar transações do localStorage:', error);
        // Em caso de erro, inicializa com array vazio
        setTransactions([]);
      }
    }
  }, []);
  
  // Salvar transações no localStorage sempre que elas mudarem
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);
  
  // Calcular os saldos baseados nas transações
  const saldos = calcularSaldos(transactions);
  
  // Função para verificar se uma transação está vencida
  const isTransactionOverdue = (transaction) => {
    if (transaction.status !== 'pendente' || !transaction.dataVencimento) return false;
    
    const today = new Date();
    const dueDate = new Date(transaction.dataVencimento);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };
  
  // Filtrar transações pendentes e vencidas para notificações
  const pendingTransactions = transactions.filter(
    transaction => transaction.status === 'pendente'
  );
  
  const overdueTransactions = transactions.filter(
    transaction => isTransactionOverdue(transaction)
  );
  
  // Função para lidar com mudanças nos inputs do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Função para adicionar ou atualizar uma transação
  const handleAddTransaction = () => {
    // Validar campos obrigatórios
    if (!newTransaction.nome || !newTransaction.valor || !newTransaction.data) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Converter o valor para número
    const valorNumerico = parseFloat(newTransaction.valor);
    
    // Definir status padrão baseado no tipo de transação
    const status = newTransaction.status || 'pendente';
    
    if (isEditing) {
      // Atualizar transação existente
      const updatedTransactions = transactions.map(transaction => 
        transaction.id === editingId ? 
        { ...newTransaction, id: editingId, valor: valorNumerico, status } : 
        transaction
      );
      
      setTransactions(updatedTransactions);
      setIsEditing(false);
      setEditingId(null);
    } else {
      // Adicionar nova transação
      const newTransactionWithId = {
        ...newTransaction,
        id: Date.now(), // ID único baseado no timestamp
        valor: valorNumerico,
        status
      };
      
      setTransactions([...transactions, newTransactionWithId]);
    }
    
    // Limpar o formulário
    setNewTransaction({
      nome: '',
      valor: '',
      tipo: 'despesa',
      data: '',
      dataVencimento: '',
      recorrente: false,
      status: 'pendente'
    });
  };
  
  // Função para começar a editar uma transação
  const handleEditTransaction = (transaction) => {
    setNewTransaction(transaction);
    setIsEditing(true);
    setEditingId(transaction.id);
    setOpenDropdownId(null);
  };
  
  // Função para excluir uma transação
  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
    setOpenDropdownId(null);
  };
  
  // Função para cancelar a edição
  const handleCancelEdit = () => {
    setNewTransaction({
      nome: '',
      valor: '',
      tipo: 'despesa',
      data: '',
      dataVencimento: '',
      recorrente: false,
      status: 'pendente'
    });
    setIsEditing(false);
    setEditingId(null);
  };
  
  // Função para alternar status de uma transação
  const handleToggleStatus = (id, tipo) => {
    setTransactions(transactions.map(transaction => {
      if (transaction.id === id) {
        const newStatus = tipo === 'receita' 
          ? (transaction.status === 'pendente' ? 'recebido' : 'pendente')
          : (transaction.status === 'pendente' ? 'pago' : 'pendente');
        
        return { ...transaction, status: newStatus };
      }
      return transaction;
    }));
    setOpenDropdownId(null);
  };
  
  // Função para limpar todas as transações (nova funcionalidade)
  const handleClearAllTransactions = () => {
    if (window.confirm('Tem certeza que deseja apagar todas as transações? Esta ação não pode ser desfeita.')) {
      setTransactions([]);
      localStorage.removeItem('transactions');
    }
  };
  
  // Função para alternar dropdown
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };
  
  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.options-dropdown')) {
        setOpenDropdownId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Formatar data para exibição
  const formatarData = (dataString) => {
    if (!dataString) return '';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  return (
    <div>
      <Header />
      <Container>
        <SectionTitle>Resumo</SectionTitle>
        <CardsContainer>
          <Card 
            title="Receitas" 
            value={formatarMoeda(saldos.receitas)} 
            bgColor="#009929" 
            textColor="white" 
          />
          <Card 
            title="Despesas" 
            value={formatarMoeda(saldos.despesas)} 
            bgColor="#e74c3c" 
            textColor="white" 
          />
          <Card 
            title="Saldo" 
            value={formatarMoeda(saldos.total)} 
            bgColor={saldos.total >= 0 ? "#000380" : "#Ffa500"} 
            textColor="white" 
          />
        </CardsContainer>
        
        {/* Notificações */}
        {(pendingTransactions.length > 0 || overdueTransactions.length > 0) && (
          <NotificationsContainer>
            <NotificationsToggle onClick={() => setShowNotifications(!showNotifications)}>
              <strong>Notificações</strong>
              {overdueTransactions.length > 0 && (
                <NotificationBadge>{overdueTransactions.length}</NotificationBadge>
              )}
              <span style={{ marginLeft: 'auto' }}>
                {showNotifications ? '▲' : '▼'}
              </span>
            </NotificationsToggle>
            
            {showNotifications && (
              <div style={{ marginTop: '1rem' }}>
                {overdueTransactions.length > 0 && (
                  <>
                    <h4>Transações Vencidas</h4>
                    {overdueTransactions.map(transaction => (
                      <NotificationItem key={transaction.id} $type="vencida">
                        <strong>{transaction.nome}</strong> - 
                        {transaction.tipo === 'receita' ? ' Recebimento' : ' Pagamento'} vencido em {formatarData(transaction.dataVencimento)} - 
                        {formatarMoeda(transaction.valor)}
                        <div style={{ marginTop: '0.5rem' }}>
                          <Button 
                            onClick={() => handleToggleStatus(transaction.id, transaction.tipo)}
                            $bgColor="#2ecc71"
                            style={{ marginRight: '0.5rem' }}
                          >
                            Marcar como {transaction.tipo === 'receita' ? 'recebido' : 'pago'}
                          </Button>
                          <Button 
                            onClick={() => handleEditTransaction(transaction)}
                            $bgColor="#3498db"
                          >
                            Editar
                          </Button>
                        </div>
                      </NotificationItem>
                    ))}
                  </>
                )}
                
                {pendingTransactions.length > 0 && !pendingTransactions.every(t => isTransactionOverdue(t)) && (
                  <>
                    <h4>Transações Pendentes</h4>
                    {pendingTransactions
                      .filter(t => !isTransactionOverdue(t))
                      .map(transaction => (
                        <NotificationItem key={transaction.id} $type="pendente">
                          <strong>{transaction.nome}</strong> - 
                          Vence em {formatarData(transaction.dataVencimento)} - 
                          {formatarMoeda(transaction.valor)}
                          <div style={{ marginTop: '0.5rem' }}>
                            <Button 
                              onClick={() => handleToggleStatus(transaction.id, transaction.tipo)}
                              $bgColor="#2ecc71"
                              style={{ marginRight: '0.5rem' }}
                            >
                              Marcar como {transaction.tipo === 'receita' ? 'recebido' : 'pago'}
                            </Button>
                            <Button 
                              onClick={() => handleEditTransaction(transaction)}
                              $bgColor="#3498db"
                            >
                              Editar
                            </Button>
                          </div>
                        </NotificationItem>
                      ))}
                  </>
                )}
              </div>
            )}
          </NotificationsContainer>
        )}
        
        {/* Adicionar os gráficos de resumo financeiro */}
        <FinancialCharts saldos={saldos} />
        
        <SectionTitle>Nova Transação</SectionTitle>
        {/* Você precisará atualizar o TransactionFormComponent para incluir o campo de data de vencimento */}
        <TransactionFormComponent 
          onInputChange={handleInputChange}
          newTransaction={newTransaction}
          onAddTransaction={handleAddTransaction}
          isEditing={isEditing}
          onCancelEdit={handleCancelEdit}
        />
        
        <TransactionsContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SectionTitle style={{ margin: 0 }}>Transações</SectionTitle>
            {transactions.length > 0 && (
              <Button 
                onClick={handleClearAllTransactions}
                $bgColor="#e74c3c"
              >
                Limpar Todas
              </Button>
            )}
          </div>
          
          <TransactionList>
            {transactions.length === 0 ? (
              <p>Nenhuma transação registrada.</p>
            ) : (
              transactions.map(transaction => {
                const isOverdue = isTransactionOverdue(transaction);
                
                return (
                  <TransactionItem key={transaction.id} $vencida={isOverdue}>
                    <TransactionInfo>
                      <strong>{transaction.nome}</strong>
                      <TransactionValue $tipo={transaction.tipo}>
                        {transaction.tipo === 'receita' ? '+ ' : '- '}
                        {formatarMoeda(transaction.valor)}
                      </TransactionValue>
                      <TransactionDate>Criada em: {formatarData(transaction.data)}</TransactionDate>
                      {transaction.dataVencimento && (
                        <DueDate $vencida={isOverdue}>
                          {isOverdue ? '⚠️ Vencida em: ' : 'Vence em: '}
                          {formatarData(transaction.dataVencimento)}
                        </DueDate>
                      )}
                      {transaction.recorrente && <small>Recorrente</small>}
                      <TransactionStatus $status={transaction.status} $vencida={isOverdue}>
                        {transaction.status}{isOverdue ? ' (Vencida)' : ''}
                      </TransactionStatus>
                    </TransactionInfo>
                    <OptionsDropdown className="options-dropdown" onClick={(e) => e.stopPropagation()}>
                      <OptionsButton onClick={() => toggleDropdown(transaction.id)}>
                        ⋮
                      </OptionsButton>
                      <DropdownContent $isOpen={openDropdownId === transaction.id}>
                        <DropdownItem onClick={() => handleToggleStatus(transaction.id, transaction.tipo)}>
                          {transaction.tipo === 'receita' 
                            ? (transaction.status === 'pendente' ? 'Marcar como recebido' : 'Marcar como pendente')
                            : (transaction.status === 'pendente' ? 'Marcar como pago' : 'Marcar como pendente')
                          }
                        </DropdownItem>
                        <DropdownItem onClick={() => handleEditTransaction(transaction)}>
                          Editar
                        </DropdownItem>
                        <DropdownItem onClick={() => handleDeleteTransaction(transaction.id)}>
                          Excluir
                        </DropdownItem>
                      </DropdownContent>
                    </OptionsDropdown>
                  </TransactionItem>
                );
              })
            )}
          </TransactionList>
        </TransactionsContainer>
      </Container>
    </div>
  );
};

// Botão estilizado para reutilização
const Button = styled.button`
  background-color: ${props => props.$bgColor || '#3498db'};
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    opacity: 0.9;
  }
`;

export default App;