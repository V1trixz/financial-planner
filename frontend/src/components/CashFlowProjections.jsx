import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  Calculator, 
  TrendingUp, 
  Loader2, 
  PlusCircle,
  Trash2,
  BarChart3,
  DollarSign
} from 'lucide-react';

const CashFlowProjections = ({ profile, projections, onUpdate }) => {
  const { makeAuthenticatedRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProjection, setSelectedProjection] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    years: 10,
    monthly_income: profile?.monthly_income || 0,
    monthly_expenses: profile?.monthly_expenses || 0,
    monthly_savings: profile?.monthly_savings || 0,
    inflation_rate: profile?.inflation_rate || 4.5,
    investment_return: profile?.investment_return_rate || 10.0,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      years: 10,
      monthly_income: profile?.monthly_income || 0,
      monthly_expenses: profile?.monthly_expenses || 0,
      monthly_savings: profile?.monthly_savings || 0,
      inflation_rate: profile?.inflation_rate || 4.5,
      investment_return: profile?.investment_return_rate || 10.0,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await makeAuthenticatedRequest('/financial/projections/cash-flow', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Projeção calculada com sucesso!');
        setSelectedProjection(data.projections);
        setDialogOpen(false);
        resetForm();
        onUpdate && onUpdate();
      } else {
        setError(data.error || 'Erro ao calcular projeção');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectionId) => {
    if (!confirm('Tem certeza que deseja excluir esta projeção?')) return;

    try {
      const response = await makeAuthenticatedRequest(`/financial/projections/${projectionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Projeção excluída!');
        onUpdate && onUpdate();
        if (selectedProjection && projections.find(p => p.id === projectionId)) {
          setSelectedProjection(null);
        }
      } else {
        setError('Erro ao excluir projeção');
      }
    } catch (error) {
      setError('Erro de conexão');
    }
  };

  const loadProjection = (projection) => {
    setSelectedProjection(projection.projection_data);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Projeções de Fluxo de Caixa</h2>
          <p className="text-gray-400">
            Visualize seu futuro financeiro com base em diferentes cenários
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-white text-black hover:bg-gray-200"
              onClick={resetForm}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Nova Projeção
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Calcular Nova Projeção</DialogTitle>
              <DialogDescription className="text-gray-400">
                Configure os parâmetros para calcular sua projeção de fluxo de caixa
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Projeção</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Cenário Conservador, Plano de Aposentadoria"
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="years">Período (anos)</Label>
                  <Input
                    id="years"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.years}
                    onChange={(e) => setFormData({ ...formData, years: parseInt(e.target.value) || 10 })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_income">Renda Mensal (R$)</Label>
                  <Input
                    id="monthly_income"
                    type="number"
                    step="0.01"
                    value={formData.monthly_income}
                    onChange={(e) => setFormData({ ...formData, monthly_income: parseFloat(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_expenses">Gastos Mensais (R$)</Label>
                  <Input
                    id="monthly_expenses"
                    type="number"
                    step="0.01"
                    value={formData.monthly_expenses}
                    onChange={(e) => setFormData({ ...formData, monthly_expenses: parseFloat(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_savings">Poupança Mensal (R$)</Label>
                  <Input
                    id="monthly_savings"
                    type="number"
                    step="0.01"
                    value={formData.monthly_savings}
                    onChange={(e) => setFormData({ ...formData, monthly_savings: parseFloat(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inflation_rate">Taxa de Inflação (%)</Label>
                  <Input
                    id="inflation_rate"
                    type="number"
                    step="0.1"
                    value={formData.inflation_rate}
                    onChange={(e) => setFormData({ ...formData, inflation_rate: parseFloat(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investment_return">Retorno de Investimento (%)</Label>
                  <Input
                    id="investment_return"
                    type="number"
                    step="0.1"
                    value={formData.investment_return}
                    onChange={(e) => setFormData({ ...formData, investment_return: parseFloat(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    Calcular Projeção
                  </>
                )}
              </Button>

              {error && (
                <Alert className="bg-red-900 border-red-700 text-red-100">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="bg-green-900 border-green-700 text-green-100">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && !dialogOpen && (
        <Alert className="bg-red-900 border-red-700 text-red-100">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saved Projections */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Projeções Salvas</CardTitle>
            <CardDescription className="text-gray-400">
              Clique para visualizar uma projeção
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projections.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhuma projeção salva
              </p>
            ) : (
              projections.map((projection) => (
                <div key={projection.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-white">{projection.projection_name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(projection.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadProjection(projection)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(projection.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chart Visualization */}
        <div className="lg:col-span-2 space-y-6">
          {selectedProjection ? (
            <>
              {/* Accumulated Savings Chart */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Evolução do Patrimônio</CardTitle>
                  <CardDescription className="text-gray-400">
                    Crescimento das suas economias ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedProjection}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="year" 
                          stroke="#9CA3AF"
                          tick={{ fill: '#9CA3AF' }}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          tick={{ fill: '#9CA3AF' }}
                          tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                          formatter={(value) => [formatCurrency(value), 'Patrimônio Acumulado']}
                          labelFormatter={(label) => `Ano ${label}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="accumulated_savings" 
                          stroke="#10B981" 
                          strokeWidth={3}
                          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Annual Cash Flow Chart */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Fluxo de Caixa Anual</CardTitle>
                  <CardDescription className="text-gray-400">
                    Receitas vs Despesas por ano
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedProjection}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="year" 
                          stroke="#9CA3AF"
                          tick={{ fill: '#9CA3AF' }}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          tick={{ fill: '#9CA3AF' }}
                          tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                          formatter={(value, name) => [
                            formatCurrency(value), 
                            name === 'annual_income' ? 'Receita Anual' : 'Despesas Anuais'
                          ]}
                          labelFormatter={(label) => `Ano ${label}`}
                        />
                        <Bar dataKey="annual_income" fill="#10B981" name="annual_income" />
                        <Bar dataKey="annual_expenses" fill="#EF4444" name="annual_expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Table */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Resumo da Projeção</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Patrimônio Final</p>
                      <p className="text-xl font-bold text-green-400">
                        {formatCurrency(selectedProjection[selectedProjection.length - 1]?.accumulated_savings || 0)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Receita Total</p>
                      <p className="text-xl font-bold text-blue-400">
                        {formatCurrency(selectedProjection.reduce((total, year) => total + year.annual_income, 0))}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Despesas Totais</p>
                      <p className="text-xl font-bold text-red-400">
                        {formatCurrency(selectedProjection.reduce((total, year) => total + year.annual_expenses, 0))}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Economia Total</p>
                      <p className="text-xl font-bold text-yellow-400">
                        {formatCurrency(selectedProjection.reduce((total, year) => total + year.annual_savings, 0))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="text-center py-12">
                <Calculator className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Nenhuma projeção selecionada
                </h3>
                <p className="text-gray-400 mb-4">
                  Crie uma nova projeção ou selecione uma existente para visualizar os gráficos
                </p>
                <Button 
                  className="bg-white text-black hover:bg-gray-200"
                  onClick={() => setDialogOpen(true)}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Criar Primeira Projeção
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashFlowProjections;

