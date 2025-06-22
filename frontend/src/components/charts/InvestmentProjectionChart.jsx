import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const InvestmentProjectionChart = ({ data, title = "Projeção de Investimentos" }) => {
  // Dados de exemplo se não fornecidos
  const defaultData = [
    { ano: '2024', valorInvestido: 12000, valorProjetado: 13200, rendimento: 1200 },
    { ano: '2025', valorInvestido: 24000, valorProjetado: 27840, rendimento: 3840 },
    { ano: '2026', valorInvestido: 36000, valorProjetado: 44380, rendimento: 8380 },
    { ano: '2027', valorInvestido: 48000, valorProjetado: 62905, rendimento: 14905 },
    { ano: '2028', valorInvestido: 60000, valorProjetado: 83654, rendimento: 23654 },
    { ano: '2029', valorInvestido: 72000, valorProjetado: 106892, rendimento: 34892 },
    { ano: '2030', valorInvestido: 84000, valorProjetado: 132921, rendimento: 48921 }
  ];

  const chartData = data || defaultData;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="w-full h-96 bg-gray-900 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="ano" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            formatter={(value) => [formatCurrency(value), '']}
          />
          <Legend />
          <Bar 
            dataKey="valorInvestido" 
            fill="#3B82F6" 
            name="Valor Investido"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="rendimento" 
            fill="#10B981" 
            name="Rendimento"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentProjectionChart;

