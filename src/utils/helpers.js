// Constantes para as cores do tema
export const COLORS = {
  positive: '#000380', // Azul para valores positivos
  negative: '#Ffa500', // Vermelho para valores negativos
  receita: '#009929',  // Verde para receitas no gráfico
  despesa: '#e74c3c',  // Vermelho para despesas no gráfico
  background: '#f5f5f5',
  text: '#333333',
};

/**
 * Formata um valor monetário para o formato R$ 0,00
 * @param {number} valor - Valor a ser formatado
 * @returns {string} - Valor formatado
 */
export const formatarMoeda = (valor) => {
  // Garantir que o valor é um número
  const valorNumerico = Number(valor) || 0;
  return `R$ ${valorNumerico.toFixed(2)}`;
};

/**
 * Calcula os saldos (receitas, despesas, total)
 * @param {Array} transactions - Lista de transações
 * @returns {Object} - Objeto com os saldos calculados
 */
export const calcularSaldos = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return {
      receitas: 0,
      despesas: 0,
      total: 0
    };
  }

  const totalReceitas = transactions
    .filter(t => t.tipo === 'receita')
    .reduce((sum, item) => sum + parseFloat(item.valor), 0);
    
  const totalDespesas = transactions
    .filter(t => t.tipo === 'despesa')
    .reduce((sum, item) => sum + parseFloat(item.valor), 0);
    
  const saldoTotal = totalReceitas - totalDespesas;
  
  return {
    receitas: totalReceitas,
    despesas: totalDespesas,
    total: saldoTotal
  };
};

/**
 * Prepara dados para os gráficos
 * @param {Object} saldos - Objeto com os saldos calculados
 * @returns {Object} - Dados formatados para os gráficos
 */
export const prepareChartData = (saldos) => {
  // Dados para gráfico de barras
  const barData = [
    { name: 'Receitas', valor: saldos.receitas },
    { name: 'Despesas', valor: saldos.despesas },
    { name: 'Saldo', valor: saldos.total }
  ];
  
  // Dados para gráfico de pizza
  const pieData = [
    { name: 'Receitas', valor: saldos.receitas },
    { name: 'Despesas', valor: saldos.despesas }
  ];
  
  return { barData, pieData };
};

/**
 * Verifica transações próximas ao vencimento (7 dias)
 * @param {Array} transactions - Lista de transações
 * @returns {Array} - Lista de transações próximas ao vencimento
 */
export const verificarVencimentos = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  const hoje = new Date();
  const proximaSemana = new Date();
  proximaSemana.setDate(hoje.getDate() + 7);
  
  const transacoesProximasAoVencimento = transactions.filter(t => {
    if (t.data) {
      const dataVencimento = new Date(t.data);
      return dataVencimento >= hoje && dataVencimento <= proximaSemana;
    }
    return false;
  });
  
  return transacoesProximasAoVencimento;
};