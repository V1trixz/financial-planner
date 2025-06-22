import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  BarChart3,
  Globe,
  Zap,
  AlertCircle
} from 'lucide-react';

const MarketData = () => {
  const { makeAuthenticatedRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [marketData, setMarketData] = useState({
    inflation: null,
    interestRates: null,
    stocks: [],
    indices: [],
    economicIndicators: null,
  });

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    setError('');

    try {
      // Carregar dados de inflação
      const inflationResponse = await makeAuthenticatedRequest('/market/inflation?country=brazil');
      if (inflationResponse.ok) {
        const inflationData = await inflationResponse.json();
        setMarketData(prev => ({ ...prev, inflation: inflationData }));
      }

      // Carregar taxas de juros
      const ratesResponse = await makeAuthenticatedRequest('/market/interest-rates');
      if (ratesResponse.ok) {
        const ratesData = await ratesResponse.json();
        setMarketData(prev => ({ ...prev, interestRates: ratesData }));
      }

      // Carregar dados de ações
      const stocksResponse = await makeAuthenticatedRequest('/market/investments/stocks');
      if (stocksResponse.ok) {
        const stocksData = await stocksResponse.json();
        setMarketData(prev => ({ ...prev, stocks: stocksData.stocks || [] }));
      }

      // Carregar índices
      const indicesResponse = await makeAuthenticatedRequest('/market/investments/indices');
      if (indicesResponse.ok) {
        const indicesData = await indicesResponse.json();
        setMarketData(prev => ({ ...prev, indices: indicesData.indices || [] }));
      }

      // Carregar indicadores econômicos
      const indicatorsResponse = await makeAuthenticatedRequest('/market/economic-indicators');
      if (indicatorsResponse.ok) {
        const indicatorsData = await indicatorsResponse.json();
        setMarketData(prev => ({ ...prev, economicIndicators: indicatorsData }));
      }

    } catch (error) {
      setError('Erro ao carregar dados de mercado');
    } finally {
      setLoading(false);
    }
  };

  const updateLiveData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await makeAuthenticatedRequest('/market/update-live-data', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        await loadMarketData(); // Recarregar dados após atualização
      } else {
        setError(data.error || 'Erro ao atualizar dados');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const formatPercentage = (value, showSign = true) => {
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return BarChart3;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dados de Mercado</h2>
          <p className="text-gray-400">
            Informações financeiras e econômicas em tempo real
          </p>
        </div>
        
        <Button 
          onClick={updateLiveData}
          disabled={loading}
          className="bg-white text-black hover:bg-gray-200"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Atualizando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Dados
            </>
          )}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert className="bg-red-900 border-red-700 text-red-100">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inflation and Interest Rates */}
        <div className="space-y-6">
          {/* Inflation */}
          {marketData.inflation && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-orange-400" />
                  <span>Inflação - Brasil</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Última atualização: {marketData.inflation.data.last_updated}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Taxa Atual</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {formatPercentage(marketData.inflation.data.current_rate, false)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Meta</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {formatPercentage(marketData.inflation.data.target, false)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Últimos 12 meses</p>
                  <p className="text-lg font-semibold text-white">
                    {formatPercentage(marketData.inflation.data.last_12_months, false)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interest Rates */}
          {marketData.interestRates && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  <span>Taxas de Juros</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-white">SELIC</p>
                      <p className="text-sm text-gray-400">Taxa básica de juros</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-400">
                        {formatPercentage(marketData.interestRates.data.selic.current_rate, false)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {marketData.interestRates.data.selic.last_updated}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-white">CDI</p>
                      <p className="text-sm text-gray-400">Certificado de Depósito Interbancário</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">
                        {formatPercentage(marketData.interestRates.data.cdi.current_rate, false)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {marketData.interestRates.data.cdi.last_updated}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stocks and Indices */}
        <div className="space-y-6">
          {/* Stock Indices */}
          {marketData.indices.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <span>Índices</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {marketData.indices.map((index, i) => {
                  const ChangeIcon = getChangeIcon(index.change);
                  return (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ChangeIcon className={`h-5 w-5 ${getChangeColor(index.change)}`} />
                        <div>
                          <p className="font-medium text-white">{index.name}</p>
                          <p className="text-sm text-gray-400">
                            {index.value.toLocaleString('pt-BR')} pontos
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getChangeColor(index.change)}`}>
                          {formatPercentage(index.change_percent)}
                        </p>
                        <p className={`text-sm ${getChangeColor(index.change)}`}>
                          {index.change > 0 ? '+' : ''}{index.change.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Top Stocks */}
          {marketData.stocks.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <span>Ações em Destaque</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {marketData.stocks.map((stock, i) => {
                  const ChangeIcon = getChangeIcon(stock.change);
                  return (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ChangeIcon className={`h-5 w-5 ${getChangeColor(stock.change)}`} />
                        <div>
                          <p className="font-medium text-white">{stock.symbol}</p>
                          <p className="text-sm text-gray-400">
                            {formatCurrency(stock.price)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getChangeColor(stock.change)}`}>
                          {formatPercentage(stock.change_percent)}
                        </p>
                        <p className={`text-sm ${getChangeColor(stock.change)}`}>
                          {stock.change > 0 ? '+' : ''}{formatCurrency(stock.change)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Economic Indicators */}
      {marketData.economicIndicators && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-yellow-400" />
              <span>Indicadores Econômicos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">PIB</p>
                <p className="text-xl font-bold text-blue-400">
                  {formatPercentage(marketData.economicIndicators.indicators.gdp_growth, false)}
                </p>
                <p className="text-xs text-gray-500">Crescimento</p>
              </div>

              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Desemprego</p>
                <p className="text-xl font-bold text-red-400">
                  {formatPercentage(marketData.economicIndicators.indicators.unemployment_rate, false)}
                </p>
                <p className="text-xs text-gray-500">Taxa</p>
              </div>

              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">USD/BRL</p>
                <p className="text-xl font-bold text-green-400">
                  R$ {marketData.economicIndicators.indicators.exchange_rate_usd.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Câmbio</p>
              </div>

              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">EUR/BRL</p>
                <p className="text-xl font-bold text-purple-400">
                  R$ {marketData.economicIndicators.indicators.exchange_rate_eur.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Câmbio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Source Info */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-400">
                Dados simulados para demonstração
              </span>
            </div>
            <Badge variant="outline" className="text-gray-400 border-gray-600">
              Demo Mode
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketData;

