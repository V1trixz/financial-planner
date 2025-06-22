import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
import FinancialProfile from './FinancialProfile';
import ExpenseManager from './ExpenseManager';
import InvestmentManager from './InvestmentManager';
import CashFlowProjections from './CashFlowProjections';
import MarketData from './MarketData';
import ApiKeyManager from './ApiKeyManager';
import CashFlowChart from './charts/CashFlowChart';
import ExpenseDistributionChart from './charts/ExpenseDistributionChart';
import InvestmentProjectionChart from './charts/InvestmentProjectionChart';
import WealthEvolutionChart from './charts/WealthEvolutionChart';
import '../App.css';

const Dashboard = () => {
  const { user, logout, makeAuthenticatedRequest } = useAuth();
  const [financialData, setFinancialData] = useState({
    profile: null,
    expenses: [],
    investments: [],
    projections: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      
      // Carregar perfil financeiro
      const profileResponse = await makeAuthenticatedRequest('/financial/profile');
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setFinancialData(prev => ({ ...prev, profile: profileData }));
      }

      // Carregar gastos
      const expensesResponse = await makeAuthenticatedRequest('/financial/expenses');
      if (expensesResponse.ok) {
        const expensesData = await expensesResponse.json();
        setFinancialData(prev => ({ ...prev, expenses: expensesData }));
      }

      // Carregar investimentos
      const investmentsResponse = await makeAuthenticatedRequest('/financial/investments');
      if (investmentsResponse.ok) {
        const investmentsData = await investmentsResponse.json();
        setFinancialData(prev => ({ ...prev, investments: investmentsData }));
      }

      // Carregar projeções
      const projectionsResponse = await makeAuthenticatedRequest('/financial/projections');
      if (projectionsResponse.ok) {
        const projectionsData = await projectionsResponse.json();
        setFinancialData(prev => ({ ...prev, projections: projectionsData }));
      }

    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalExpenses = () => {
    return financialData.expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateTotalInvestments = () => {
    return financialData.investments.reduce((total, investment) => total + investment.amount, 0);
  };

  const calculateNetWorth = () => {
    const profile = financialData.profile;
    if (!profile) return 0;
    
    const totalInvestments = calculateTotalInvestments();
    const monthlySavings = profile.monthly_savings || 0;
    
    return totalInvestments + (monthlySavings * 12); // Estimativa simples
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto" />
          <p>Carregando seus dados financeiros...</p>
        </div>
      </div>
    );
  }

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
                R$ {financialData.profile?.monthly_income?.toLocaleString('pt-BR') || '0'}
              </div>
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
                R$ {calculateTotalExpenses().toLocaleString('pt-BR')}
              </div>
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
                R$ {calculateTotalInvestments().toLocaleString('pt-BR')}
              </div>
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
                R$ {calculateNetWorth().toLocaleString('pt-BR')}
              </div>
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
            <TabsTrigger value="market" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <RefreshCw className="h-4 w-4 mr-2" />
              Mercado
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <FinancialProfile 
                profile={financialData.profile} 
                onUpdate={loadFinancialData}
              />
              <MarketData />
            </div>
            
            {/* Gráficos Financeiros */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CashFlowChart />
              <ExpenseDistributionChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InvestmentProjectionChart />
              <WealthEvolutionChart />
            </div>
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseManager 
              expenses={financialData.expenses}
              onUpdate={loadFinancialData}
            />
          </TabsContent>

          <TabsContent value="investments">
            <InvestmentManager 
              investments={financialData.investments}
              onUpdate={loadFinancialData}
            />
          </TabsContent>

          <TabsContent value="projections">
            <CashFlowProjections 
              profile={financialData.profile}
              projections={financialData.projections}
              onUpdate={loadFinancialData}
            />
          </TabsContent>

          <TabsContent value="market">
            <MarketData />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialProfile 
                profile={financialData.profile} 
                onUpdate={loadFinancialData}
              />
              <ApiKeyManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

