import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Trash2, 
  TrendingUp,
  Loader2,
  DollarSign,
  PieChart,
  BarChart3,
  Shield,
  Zap,
  AlertTriangle
} from 'lucide-react';

const InvestmentManager = ({ investments, onUpdate }) => {
  const { makeAuthenticatedRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    investment_type: '',
    name: '',
    amount: 0,
    expected_return: 0,
    risk_level: 'medium',
  });

  const investmentTypes = [
    { value: 'stocks', label: 'Ações', icon: TrendingUp },
    { value: 'bonds', label: 'Títulos', icon: Shield },
    { value: 'savings', label: 'Poupança', icon: PieChart },
    { value: 'real_estate', label: 'Imóveis', icon: BarChart3 },
    { value: 'crypto', label: 'Criptomoedas', icon: Zap },
    { value: 'funds', label: 'Fundos', icon: DollarSign },
  ];

  const riskLevels = {
    low: { label: 'Baixo', color: 'bg-green-500', icon: Shield },
    medium: { label: 'Médio', color: 'bg-yellow-500', icon: BarChart3 },
    high: { label: 'Alto', color: 'bg-red-500', icon: AlertTriangle },
  };

  const resetForm = () => {
    setFormData({
      investment_type: '',
      name: '',
      amount: 0,
      expected_return: 0,
      risk_level: 'medium',
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
      const response = await makeAuthenticatedRequest('/financial/investments', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Investimento adicionado com sucesso!');
        setDialogOpen(false);
        resetForm();
        onUpdate && onUpdate();
      } else {
        setError(data.error || 'Erro ao adicionar investimento');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (investmentId) => {
    if (!confirm('Tem certeza que deseja excluir este investimento?')) return;

    try {
      const response = await makeAuthenticatedRequest(`/financial/investments/${investmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Investimento excluído!');
        onUpdate && onUpdate();
      } else {
        setError('Erro ao excluir investimento');
      }
    } catch (error) {
      setError('Erro de conexão');
    }
  };

  const totalInvestments = investments.reduce((total, investment) => total + investment.amount, 0);
  const averageReturn = investments.length > 0 
    ? investments.reduce((total, investment) => total + investment.expected_return, 0) / investments.length
    : 0;

  const groupedInvestments = investments.reduce((groups, investment) => {
    const type = investment.investment_type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(investment);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Investimentos</h2>
          <div className="flex items-center space-x-4 text-gray-400">
            <span>Total: R$ {totalInvestments.toLocaleString('pt-BR')}</span>
            <span>Retorno médio: {averageReturn.toFixed(1)}%</span>
          </div>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-white text-black hover:bg-gray-200"
              onClick={resetForm}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Investimento
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Investimento</DialogTitle>
              <DialogDescription className="text-gray-400">
                Adicione um investimento ao seu portfólio
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="investment_type">Tipo de Investimento</Label>
                <Select 
                  value={formData.investment_type} 
                  onValueChange={(value) => setFormData({ ...formData, investment_type: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {investmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome do Investimento</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: PETR4, Tesouro IPCA+, Apartamento Centro"
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor Investido (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_return">Retorno Esperado (% ao ano)</Label>
                <Input
                  id="expected_return"
                  type="number"
                  step="0.1"
                  value={formData.expected_return}
                  onChange={(e) => setFormData({ ...formData, expected_return: parseFloat(e.target.value) || 0 })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="risk_level">Nível de Risco</Label>
                <Select 
                  value={formData.risk_level} 
                  onValueChange={(value) => setFormData({ ...formData, risk_level: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione o risco" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {Object.entries(riskLevels).map(([key, risk]) => (
                      <SelectItem key={key} value={key}>
                        {risk.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  'Adicionar Investimento'
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

      {/* Investments by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(groupedInvestments).map(([type, typeInvestments]) => {
          const investmentType = investmentTypes.find(t => t.value === type);
          const typeTotal = typeInvestments.reduce((total, inv) => total + inv.amount, 0);
          const typeAvgReturn = typeInvestments.reduce((total, inv) => total + inv.expected_return, 0) / typeInvestments.length;
          
          return (
            <Card key={type} className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {investmentType && <investmentType.icon className="h-5 w-5" />}
                  <span>{investmentType?.label || type}</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  R$ {typeTotal.toLocaleString('pt-BR')} • {typeAvgReturn.toFixed(1)}% retorno médio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {typeInvestments.map((investment) => {
                  const risk = riskLevels[investment.risk_level];
                  return (
                    <div key={investment.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-white">{investment.name}</p>
                          <Badge className={`${risk.color} text-white text-xs`}>
                            {risk.label}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>R$ {investment.amount.toLocaleString('pt-BR')}</span>
                          <span>{investment.expected_return}% a.a.</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(investment.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {investments.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Nenhum investimento cadastrado
            </h3>
            <p className="text-gray-400 mb-4">
              Comece adicionando seus investimentos para acompanhar seu portfólio
            </p>
            <Button 
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => setDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Primeiro Investimento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvestmentManager;

