from flask import Blueprint, jsonify, request
import requests
import json
from datetime import datetime, timedelta
from src.routes.auth import require_auth

market_bp = Blueprint('market', __name__)

# Dados simulados para demonstração
MOCK_INFLATION_DATA = {
    'brazil': {
        'current_rate': 4.62,
        'last_12_months': 4.62,
        'target': 3.0,
        'last_updated': '2025-06-21'
    }
}

MOCK_INTEREST_RATES = {
    'selic': {
        'current_rate': 10.75,
        'last_updated': '2025-06-21',
        'next_meeting': '2025-07-31'
    },
    'cdi': {
        'current_rate': 10.65,
        'last_updated': '2025-06-21'
    }
}

MOCK_INVESTMENT_DATA = {
    'stocks': [
        {'symbol': 'PETR4', 'price': 30.81, 'change': 2.73, 'change_percent': 9.72},
        {'symbol': 'VALE3', 'price': 65.42, 'change': -1.23, 'change_percent': -1.85},
        {'symbol': 'ITUB4', 'price': 32.15, 'change': 0.87, 'change_percent': 2.78},
        {'symbol': 'BBDC4', 'price': 14.92, 'change': 0.34, 'change_percent': 2.33}
    ],
    'indices': [
        {'name': 'IBOVESPA', 'value': 126543.21, 'change': 1234.56, 'change_percent': 0.98},
        {'name': 'IFIX', 'value': 2876.43, 'change': -12.34, 'change_percent': -0.43}
    ]
}

@market_bp.route('/inflation', methods=['GET'])
@require_auth
def get_inflation_data():
    try:
        country = request.args.get('country', 'brazil')
        
        # Tentar buscar dados reais da API (se disponível)
        # Por enquanto, retornar dados simulados
        
        if country.lower() in MOCK_INFLATION_DATA:
            return jsonify({
                'country': country,
                'data': MOCK_INFLATION_DATA[country.lower()],
                'source': 'mock_data'
            }), 200
        else:
            return jsonify({'error': 'Country not supported'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@market_bp.route('/interest-rates', methods=['GET'])
@require_auth
def get_interest_rates():
    try:
        return jsonify({
            'data': MOCK_INTEREST_RATES,
            'source': 'mock_data',
            'last_updated': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@market_bp.route('/investments/stocks', methods=['GET'])
@require_auth
def get_stock_data():
    try:
        symbols = request.args.get('symbols', '').split(',')
        
        if symbols and symbols[0]:
            # Filtrar apenas os símbolos solicitados
            filtered_stocks = [
                stock for stock in MOCK_INVESTMENT_DATA['stocks']
                if stock['symbol'] in symbols
            ]
            return jsonify({
                'stocks': filtered_stocks,
                'source': 'mock_data'
            }), 200
        else:
            return jsonify({
                'stocks': MOCK_INVESTMENT_DATA['stocks'],
                'source': 'mock_data'
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@market_bp.route('/investments/indices', methods=['GET'])
@require_auth
def get_indices_data():
    try:
        return jsonify({
            'indices': MOCK_INVESTMENT_DATA['indices'],
            'source': 'mock_data',
            'last_updated': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@market_bp.route('/update-live-data', methods=['POST'])
@require_auth
def update_live_data():
    """
    Endpoint para atualizar dados com APIs externas
    Requer chaves de API configuradas pelo usuário
    """
    try:
        user = request.current_user
        
        # Verificar se o usuário tem chaves de API configuradas
        api_keys = user.api_keys
        
        if not api_keys:
            return jsonify({
                'error': 'No API keys configured. Please add API keys first.',
                'suggestion': 'Add API keys for brapi.dev or other financial data providers'
            }), 400
        
        # Aqui seria implementada a lógica para buscar dados reais
        # usando as chaves de API do usuário
        
        updated_data = {
            'inflation': MOCK_INFLATION_DATA,
            'interest_rates': MOCK_INTEREST_RATES,
            'investments': MOCK_INVESTMENT_DATA,
            'last_updated': datetime.now().isoformat(),
            'status': 'updated_with_mock_data'
        }
        
        return jsonify({
            'message': 'Live data updated successfully',
            'data': updated_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@market_bp.route('/economic-indicators', methods=['GET'])
@require_auth
def get_economic_indicators():
    try:
        # Dados econômicos simulados
        indicators = {
            'gdp_growth': 2.1,
            'unemployment_rate': 8.5,
            'exchange_rate_usd': 5.23,
            'exchange_rate_eur': 5.67,
            'commodity_prices': {
                'oil_brent': 82.45,
                'gold': 1987.32,
                'coffee': 156.78
            },
            'last_updated': datetime.now().isoformat()
        }
        
        return jsonify({
            'indicators': indicators,
            'source': 'mock_data'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def fetch_brapi_data(api_key, endpoint):
    """
    Função auxiliar para buscar dados da brapi.dev
    """
    try:
        headers = {'Authorization': f'Bearer {api_key}'}
        response = requests.get(f'https://brapi.dev/api/{endpoint}', headers=headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            return None
            
    except Exception:
        return None

def fetch_bcb_data(endpoint):
    """
    Função auxiliar para buscar dados do Banco Central do Brasil
    """
    try:
        response = requests.get(f'https://api.bcb.gov.br/dados/serie/bcdata.sgs.{endpoint}/dados/ultimos/1?formato=json')
        
        if response.status_code == 200:
            return response.json()
        else:
            return None
            
    except Exception:
        return None

