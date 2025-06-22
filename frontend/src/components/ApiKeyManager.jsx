import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Key, 
  PlusCircle, 
  Trash2, 
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
  Shield,
  AlertCircle
} from 'lucide-react';

const ApiKeyManager = () => {
  const { makeAuthenticatedRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const [showKey, setShowKey] = useState({});
  
  const [formData, setFormData] = useState({
    key_name: '',
    api_key: '',
  });

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const response = await makeAuthenticatedRequest('/financial/api-keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
      }
    } catch (error) {
      console.error('Erro ao carregar chaves de API:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      key_name: '',
      api_key: '',
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
      const response = await makeAuthenticatedRequest('/financial/api-keys', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Chave de API adicionada com sucesso!');
        setDialogOpen(false);
        resetForm();
        loadApiKeys();
      } else {
        setError(data.error || 'Erro ao adicionar chave de API');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (keyId) => {
    if (!confirm('Tem certeza que deseja excluir esta chave de API?')) return;

    try {
      const response = await makeAuthenticatedRequest(`/financial/api-keys/${keyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Chave de API excluída!');
        loadApiKeys();
      } else {
        setError('Erro ao excluir chave de API');
      }
    } catch (error) {
      setError('Erro de conexão');
    }
  };

  const toggleShowKey = (keyId) => {
    setShowKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const apiProviders = [
    {
      name: 'brapi.dev',
      description: 'API brasileira para dados de ações, fundos e indicadores econômicos',
      url: 'https://brapi.dev',
      features: ['Cotações em tempo real', 'Dados fundamentalistas', 'Histórico de preços'],
    },
    {
      name: 'Alpha Vantage',
      description: 'API global para dados financeiros e econômicos',
      url: 'https://www.alphavantage.co',
      features: ['Ações globais', 'Forex', 'Criptomoedas', 'Indicadores técnicos'],
    },
    {
      name: 'Yahoo Finance',
      description: 'Dados financeiros gratuitos do Yahoo Finance',
      url: 'https://finance.yahoo.com',
      features: ['Cotações gratuitas', 'Dados históricos', 'Notícias financeiras'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Chaves de API</h2>
          <p className="text-gray-400">
            Configure suas chaves de API para acessar dados financeiros em tempo real
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-white text-black hover:bg-gray-200"
              onClick={resetForm}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Chave
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Chave de API</DialogTitle>
              <DialogDescription className="text-gray-400">
                Adicione uma chave de API para acessar dados financeiros em tempo real
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key_name">Nome da Chave</Label>
                <Input
                  id="key_name"
                  value={formData.key_name}
                  onChange={(e) => setFormData({ ...formData, key_name: e.target.value })}
                  placeholder="Ex: brapi.dev, Alpha Vantage"
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api_key">Chave de API</Label>
                <Input
                  id="api_key"
                  type="password"
                  value={formData.api_key}
                  onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  placeholder="Cole sua chave de API aqui"
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
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
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Adicionar Chave
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configured API Keys */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span>Chaves Configuradas</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Suas chaves de API ativas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {apiKeys.length === 0 ? (
              <div className="text-center py-8">
                <Key className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  Nenhuma chave de API configurada
                </p>
                <Button 
                  className="bg-white text-black hover:bg-gray-200"
                  onClick={() => setDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Primeira Chave
                </Button>
              </div>
            ) : (
              apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-white">{apiKey.key_name}</p>
                      {apiKey.is_active && (
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-400 font-mono">
                        {showKey[apiKey.id] ? apiKey.api_key : apiKey.api_key}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleShowKey(apiKey.id)}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        {showKey[apiKey.id] ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Criada em {new Date(apiKey.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(apiKey.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* API Providers */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="h-5 w-5 text-blue-400" />
              <span>Provedores Recomendados</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              APIs de dados financeiros confiáveis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiProviders.map((provider, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{provider.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(provider.url, '_blank')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {provider.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {provider.features.map((feature, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="py-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-1">Segurança das Chaves de API</h4>
              <p className="text-sm text-gray-400">
                Suas chaves de API são armazenadas de forma segura e criptografada. 
                Nunca compartilhe suas chaves com terceiros e revogue imediatamente 
                qualquer chave que possa ter sido comprometida.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyManager;

