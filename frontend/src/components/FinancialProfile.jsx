import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, User } from 'lucide-react';

const FinancialProfile = ({ profile, onUpdate }) => {
  const { makeAuthenticatedRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    monthly_income: profile?.monthly_income || 0,
    monthly_expenses: profile?.monthly_expenses || 0,
    monthly_savings: profile?.monthly_savings || 0,
    inflation_rate: profile?.inflation_rate || 4.5,
    investment_return_rate: profile?.investment_return_rate || 10.0,
    education_type: profile?.education_type || 'public',
    housing_cost: profile?.housing_cost || 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await makeAuthenticatedRequest('/financial/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Perfil financeiro atualizado com sucesso!');
        onUpdate && onUpdate();
      } else {
        setError(data.error || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'education_type' ? value : parseFloat(value) || 0
    }));
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Perfil Financeiro</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure seus dados financeiros para projeções mais precisas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_income">Renda Mensal (R$)</Label>
              <Input
                id="monthly_income"
                type="number"
                step="0.01"
                value={formData.monthly_income}
                onChange={(e) => handleInputChange('monthly_income', e.target.value)}
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
                onChange={(e) => handleInputChange('monthly_expenses', e.target.value)}
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
                onChange={(e) => handleInputChange('monthly_savings', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="housing_cost">Custo de Moradia (R$)</Label>
              <Input
                id="housing_cost"
                type="number"
                step="0.01"
                value={formData.housing_cost}
                onChange={(e) => handleInputChange('housing_cost', e.target.value)}
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
                onChange={(e) => handleInputChange('inflation_rate', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment_return_rate">Retorno de Investimento (%)</Label>
              <Input
                id="investment_return_rate"
                type="number"
                step="0.1"
                value={formData.investment_return_rate}
                onChange={(e) => handleInputChange('investment_return_rate', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education_type">Tipo de Educação</Label>
            <Select 
              value={formData.education_type} 
              onValueChange={(value) => handleInputChange('education_type', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Selecione o tipo de educação" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="public">Pública</SelectItem>
                <SelectItem value="private">Privada</SelectItem>
                <SelectItem value="international">Internacional</SelectItem>
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
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Perfil
              </>
            )}
          </Button>

          {error && (
            <Alert className="bg-red-900 border-red-700 text-red-100">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-900 border-green-700 text-green-100">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default FinancialProfile;

