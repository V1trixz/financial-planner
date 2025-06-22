import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  Loader2, 
  TrendingDown,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Gamepad2,
  Heart
} from 'lucide-react';

const ExpenseManager = ({ expenses, onUpdate }) => {
  const { makeAuthenticatedRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: 0,
    is_recurring: true,
  });

  const categoryIcons = {
    'Alimentação': Utensils,
    'Moradia': Home,
    'Transporte': Car,
    'Entretenimento': Gamepad2,
    'Saúde': Heart,
    'Compras': ShoppingCart,
    'Outros': TrendingDown,
  };

  const resetForm = () => {
    setFormData({
      category: '',
      description: '',
      amount: 0,
      is_recurring: true,
    });
    setEditingExpense(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = editingExpense 
        ? `/financial/expenses/${editingExpense.id}`
        : '/financial/expenses';
      
      const method = editingExpense ? 'PUT' : 'POST';

      const response = await makeAuthenticatedRequest(url, {
        method,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingExpense ? 'Gasto atualizado!' : 'Gasto adicionado!');
        setDialogOpen(false);
        resetForm();
        onUpdate && onUpdate();
      } else {
        setError(data.error || 'Erro ao salvar gasto');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId) => {
    if (!confirm('Tem certeza que deseja excluir este gasto?')) return;

    try {
      const response = await makeAuthenticatedRequest(`/financial/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Gasto excluído!');
        onUpdate && onUpdate();
      } else {
        setError('Erro ao excluir gasto');
      }
    } catch (error) {
      setError('Erro de conexão');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      is_recurring: expense.is_recurring,
    });
    setDialogOpen(true);
  };

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const recurringExpenses = expenses.filter(expense => expense.is_recurring);
  const oneTimeExpenses = expenses.filter(expense => !expense.is_recurring);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Gastos</h2>
          <p className="text-gray-400">
            Total mensal: R$ {totalExpenses.toLocaleString('pt-BR')}
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-white text-black hover:bg-gray-200"
              onClick={resetForm}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Gasto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? 'Editar Gasto' : 'Adicionar Novo Gasto'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingExpense ? 'Atualize as informações do gasto' : 'Adicione um novo gasto ao seu orçamento'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Alimentação, Moradia, Transporte"
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do gasto"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_recurring"
                  checked={formData.is_recurring}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked })}
                />
                <Label htmlFor="is_recurring">Gasto recorrente (mensal)</Label>
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
                  editingExpense ? 'Atualizar Gasto' : 'Adicionar Gasto'
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

      {/* Expenses List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recurring Expenses */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-green-400">Gastos Recorrentes</CardTitle>
            <CardDescription className="text-gray-400">
              R$ {recurringExpenses.reduce((total, expense) => total + expense.amount, 0).toLocaleString('pt-BR')} / mês
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recurringExpenses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum gasto recorrente cadastrado
              </p>
            ) : (
              recurringExpenses.map((expense) => {
                const IconComponent = categoryIcons[expense.category] || TrendingDown;
                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-white">{expense.category}</p>
                        {expense.description && (
                          <p className="text-sm text-gray-400">{expense.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">
                        R$ {expense.amount.toLocaleString('pt-BR')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* One-time Expenses */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-yellow-400">Gastos Únicos</CardTitle>
            <CardDescription className="text-gray-400">
              R$ {oneTimeExpenses.reduce((total, expense) => total + expense.amount, 0).toLocaleString('pt-BR')} total
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {oneTimeExpenses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum gasto único cadastrado
              </p>
            ) : (
              oneTimeExpenses.map((expense) => {
                const IconComponent = categoryIcons[expense.category] || TrendingDown;
                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-white">{expense.category}</p>
                        {expense.description && (
                          <p className="text-sm text-gray-400">{expense.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">
                        R$ {expense.amount.toLocaleString('pt-BR')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseManager;

