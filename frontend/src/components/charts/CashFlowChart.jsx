import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CashFlowChart = ({ data, title = "Fluxo de Caixa" }) => {
  // Dados de exemplo se não fornecidos
  const defaultData = [
    { mes: 'Jan', receita: 5000, despesas: 3500, saldo: 1500 },
    { mes: 'Fev', receita: 5200, despesas: 3600, saldo: 1600 },
    { mes: 'Mar', receita: 5100, despesas: 3800, saldo: 1300 },
    { mes: 'Abr', receita: 5300, despesas: 3700, saldo: 1600 },
    { mes: 'Mai', receita: 5400, despesas: 3900, saldo: 1500 },
    { mes: 'Jun', receita: 5500, despesas: 4000, saldo: 1500 },
    { mes: 'Jul', receita: 5600, despesas: 4100, saldo: 1500 },
    { mes: 'Ago', receita: 5700, despesas: 4200, saldo: 1500 },
    { mes: 'Set', receita: 5800, despesas: 4300, saldo: 1500 },
    { mes: 'Out', receita: 5900, despesas: 4400, saldo: 1500 },
    { mes: 'Nov', receita: 6000, despesas: 4500, saldo: 1500 },
    { mes: 'Dez', receita: 6100, despesas: 4600, saldo: 1500 }
  ];

  const chartData = data || defaultData;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="w-full h-96 bg-gray-900 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="mes" 
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
          <Line 
            type="monotone" 
            dataKey="receita" 
            stroke="#10B981" 
            strokeWidth={2}
            name="Receita"
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="despesas" 
            stroke="#EF4444" 
            strokeWidth={2}
            name="Despesas"
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="saldo" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Saldo"
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashFlowChart;

