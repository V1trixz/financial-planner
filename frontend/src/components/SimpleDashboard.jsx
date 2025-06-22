import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  Settings, 
  LogOut,
  BarChart3,
  PieChart,
  Wallet,
  Target,
  RefreshCw
} from 'lucide-react';
import CashFlowChart from './charts/CashFlowChart';
import ExpenseDistributionChart from './charts/ExpenseDistributionChart';
import InvestmentProjectionChart from './charts/InvestmentProjectionChart';
import WealthEvolutionChart from './charts/WealthEvolutionChart';
import '../App.css';

const SimpleDashboard = () => {
  const [user] = useState({ username: 'Demo User', access_key: 'demo123456789' });

  // Dados simulados
  const financialData = {
    monthlyIncome: 5500,
    totalExpenses: 4000,
    totalInvestments: 25000,
    netWorth: 45000
  };

  const logout = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg">
              <DollarSign className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-xl font-bold">Financial Planner</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Olá, {user?.username}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-400 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Renda Mensal
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                R$ {financialData.monthlyIncome?.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-green-400 mt-1">+5% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Gastos Mensais
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                R$ {financialData.totalExpenses?.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-red-400 mt-1">+2% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Investimentos
              </CardTitle>
              <Wallet className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                R$ {financialData.totalInvestments?.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-blue-400 mt-1">+8% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Patrimônio Líquido
              </CardTitle>
              <Target className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                R$ {financialData.netWorth?.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-yellow-400 mt-1">+12% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <BarChart3 className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="expenses" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <TrendingDown className="h-4 w-4 mr-2" />
              Gastos
            </TabsTrigger>
            <TabsTrigger value="investments" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <TrendingUp className="h-4 w-4 mr-2" />
              Investimentos
            </TabsTrigger>
            <TabsTrigger value="projections" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <PieChart className="h-4 w-4 mr-2" />
              Projeções
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Gráficos Financeiros */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CashFlowChart />
              <ExpenseDistributionChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InvestmentProjectionChart />
              <WealthEvolutionChart />
            </div>
            
            {/* Resumo de Metas */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Metas Financeiras</CardTitle>
                <CardDescription className="text-gray-400">
                  Acompanhe o progresso das suas metas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Reserva de Emergência</span>
                    <span className="text-white">75%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Aposentadoria</span>
                    <span className="text-white">45%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Casa Própria</span>
                    <span className="text-white">30%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpenseDistributionChart title="Distribuição de Gastos Mensais" />
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Gastos por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Moradia</span>
                    <span className="text-white font-semibold">R$ 1.500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Alimentação</span>
                    <span className="text-white font-semibold">R$ 800</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Transporte</span>
                    <span className="text-white font-semibold">R$ 600</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Saúde</span>
                    <span className="text-white font-semibold">R$ 400</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Educação</span>
                    <span className="text-white font-semibold">R$ 300</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="investments">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InvestmentProjectionChart title="Projeção de Investimentos" />
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Carteira de Investimentos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tesouro Direto</span>
                    <span className="text-white font-semibold">R$ 10.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Fundos de Investimento</span>
                    <span className="text-white font-semibold">R$ 8.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Ações</span>
                    <span className="text-white font-semibold">R$ 5.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">CDB</span>
                    <span className="text-white font-semibold">R$ 2.000</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projections">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WealthEvolutionChart title="Evolução Patrimonial Projetada" />
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Simulador de Aposentadoria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">R$ 1.2M</div>
                    <p className="text-gray-400">Valor estimado aos 65 anos</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contribuição mensal:</span>
                      <span className="text-white">R$ 1.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tempo restante:</span>
                      <span className="text-white">25 anos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Taxa de retorno:</span>
                      <span className="text-white">8% a.a.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SimpleDashboard;

