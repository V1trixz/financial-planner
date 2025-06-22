import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const WealthEvolutionChart = ({ data, title = "Evolução Patrimonial" }) => {
  // Dados de exemplo se não fornecidos
  const defaultData = [
    { mes: 'Jan', patrimonio: 50000, investimentos: 30000, poupanca: 20000 },
    { mes: 'Fev', patrimonio: 52500, investimentos: 31500, poupanca: 21000 },
    { mes: 'Mar', patrimonio: 55200, investimentos: 33200, poupanca: 22000 },
    { mes: 'Abr', patrimonio: 58100, investimentos: 35100, poupanca: 23000 },
    { mes: 'Mai', patrimonio: 61200, investimentos: 37200, poupanca: 24000 },
    { mes: 'Jun', patrimonio: 64500, investimentos: 39500, poupanca: 25000 },
    { mes: 'Jul', patrimonio: 68000, investimentos: 42000, poupanca: 26000 },
    { mes: 'Ago', patrimonio: 71800, investimentos: 44800, poupanca: 27000 },
    { mes: 'Set', patrimonio: 75900, investimentos: 47900, poupanca: 28000 },
    { mes: 'Out', patrimonio: 80300, investimentos: 51300, poupanca: 29000 },
    { mes: 'Nov', patrimonio: 85000, investimentos: 55000, poupanca: 30000 },
    { mes: 'Dez', patrimonio: 90100, investimentos: 59100, poupanca: 31000 }
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
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPatrimonio" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorInvestimentos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorPoupanca" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
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
          <Area 
            type="monotone" 
            dataKey="poupanca" 
            stackId="1" 
            stroke="#F59E0B" 
            fill="url(#colorPoupanca)"
            name="Poupança"
          />
          <Area 
            type="monotone" 
            dataKey="investimentos" 
            stackId="1" 
            stroke="#10B981" 
            fill="url(#colorInvestimentos)"
            name="Investimentos"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WealthEvolutionChart;

