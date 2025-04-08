import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COLORS } from '../utils/helpers';

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin: 2rem 0;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ChartCard = styled.div`
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  height: 300px;
`;

const FinancialCharts = ({ saldos }) => {
  // Preparar dados para os gráficos
  const barData = [
    { name: 'Receitas', valor: saldos.receitas, fill: COLORS.receita },
    { name: 'Despesas', valor: saldos.despesas, fill: COLORS.despesa },
    { name: 'Saldo', valor: saldos.total, fill: saldos.total >= 0 ? COLORS.positive : COLORS.negative }
  ];
  
  const pieData = [
    { name: 'Receitas', valor: saldos.receitas },
    { name: 'Despesas', valor: saldos.despesas }
  ];
  
  // Cores para o gráfico de pizza
  const pieColors = [COLORS.receita, COLORS.despesa];
  
  // Formatador para os valores nos tooltips
  const formatoMoeda = (valor) => `R$ ${valor.toFixed(2)}`;
  
  return (
    <ChartsContainer>
      <ChartCard>
        <h3>Resumo Financeiro</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart
            data={barData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => formatoMoeda(value)} />
            <Legend />
            <Bar dataKey="valor" name="Valor (R$)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      
      <ChartCard>
        <h3>Distribuição de Receitas e Despesas</h3>
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="valor"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatoMoeda(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </ChartsContainer>
  );
};

export default FinancialCharts;