from flask import Blueprint, jsonify, request
from src.models.financial import FinancialProfile, MonthlyExpense, Investment, CashFlowProjection, ApiKey, db
from src.routes.auth import require_auth
import json
import math

financial_bp = Blueprint('financial', __name__)

@financial_bp.route('/profile', methods=['GET'])
@require_auth
def get_financial_profile():
    try:
        user = request.current_user
        profile = user.financial_profile
        
        if not profile:
            # Criar perfil padrão se não existir
            profile = FinancialProfile(user_id=user.id)
            db.session.add(profile)
            db.session.commit()
        
        return jsonify(profile.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/profile', methods=['PUT'])
@require_auth
def update_financial_profile():
    try:
        user = request.current_user
        data = request.json
        
        profile = user.financial_profile
        if not profile:
            profile = FinancialProfile(user_id=user.id)
            db.session.add(profile)
        
        # Atualizar campos do perfil financeiro
        if 'monthly_income' in data:
            profile.monthly_income = float(data['monthly_income'])
        if 'monthly_expenses' in data:
            profile.monthly_expenses = float(data['monthly_expenses'])
        if 'monthly_savings' in data:
            profile.monthly_savings = float(data['monthly_savings'])
        if 'inflation_rate' in data:
            profile.inflation_rate = float(data['inflation_rate'])
        if 'investment_return_rate' in data:
            profile.investment_return_rate = float(data['investment_return_rate'])
        if 'education_type' in data:
            profile.education_type = data['education_type']
        if 'housing_cost' in data:
            profile.housing_cost = float(data['housing_cost'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Financial profile updated successfully',
            'profile': profile.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/expenses', methods=['GET'])
@require_auth
def get_expenses():
    try:
        user = request.current_user
        expenses = MonthlyExpense.query.filter_by(user_id=user.id).all()
        return jsonify([expense.to_dict() for expense in expenses]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/expenses', methods=['POST'])
@require_auth
def add_expense():
    try:
        user = request.current_user
        data = request.json
        
        expense = MonthlyExpense(
            user_id=user.id,
            category=data['category'],
            description=data.get('description', ''),
            amount=float(data['amount']),
            is_recurring=data.get('is_recurring', True)
        )
        
        db.session.add(expense)
        db.session.commit()
        
        return jsonify({
            'message': 'Expense added successfully',
            'expense': expense.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/expenses/<int:expense_id>', methods=['PUT'])
@require_auth
def update_expense(expense_id):
    try:
        user = request.current_user
        data = request.json
        
        expense = MonthlyExpense.query.filter_by(id=expense_id, user_id=user.id).first()
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404
        
        expense.category = data.get('category', expense.category)
        expense.description = data.get('description', expense.description)
        expense.amount = float(data.get('amount', expense.amount))
        expense.is_recurring = data.get('is_recurring', expense.is_recurring)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Expense updated successfully',
            'expense': expense.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/expenses/<int:expense_id>', methods=['DELETE'])
@require_auth
def delete_expense(expense_id):
    try:
        user = request.current_user
        
        expense = MonthlyExpense.query.filter_by(id=expense_id, user_id=user.id).first()
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404
        
        db.session.delete(expense)
        db.session.commit()
        
        return jsonify({'message': 'Expense deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/investments', methods=['GET'])
@require_auth
def get_investments():
    try:
        user = request.current_user
        investments = Investment.query.filter_by(user_id=user.id).all()
        return jsonify([investment.to_dict() for investment in investments]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/investments', methods=['POST'])
@require_auth
def add_investment():
    try:
        user = request.current_user
        data = request.json
        
        investment = Investment(
            user_id=user.id,
            investment_type=data['investment_type'],
            name=data['name'],
            amount=float(data['amount']),
            expected_return=float(data.get('expected_return', 0.0)),
            risk_level=data.get('risk_level', 'medium')
        )
        
        db.session.add(investment)
        db.session.commit()
        
        return jsonify({
            'message': 'Investment added successfully',
            'investment': investment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/investments/<int:investment_id>', methods=['DELETE'])
@require_auth
def delete_investment(investment_id):
    try:
        user = request.current_user
        
        investment = Investment.query.filter_by(id=investment_id, user_id=user.id).first()
        if not investment:
            return jsonify({'error': 'Investment not found'}), 404
        
        db.session.delete(investment)
        db.session.commit()
        
        return jsonify({'message': 'Investment deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/api-keys', methods=['GET'])
@require_auth
def get_api_keys():
    try:
        user = request.current_user
        api_keys = ApiKey.query.filter_by(user_id=user.id).all()
        return jsonify([key.to_dict() for key in api_keys]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/api-keys', methods=['POST'])
@require_auth
def add_api_key():
    try:
        user = request.current_user
        data = request.json
        
        api_key = ApiKey(
            user_id=user.id,
            key_name=data['key_name'],
            api_key=data['api_key']
        )
        
        db.session.add(api_key)
        db.session.commit()
        
        return jsonify({
            'message': 'API key added successfully',
            'api_key': api_key.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/api-keys/<int:key_id>', methods=['DELETE'])
@require_auth
def delete_api_key(key_id):
    try:
        user = request.current_user
        
        api_key = ApiKey.query.filter_by(id=key_id, user_id=user.id).first()
        if not api_key:
            return jsonify({'error': 'API key not found'}), 404
        
        db.session.delete(api_key)
        db.session.commit()
        
        return jsonify({'message': 'API key deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/projections/cash-flow', methods=['POST'])
@require_auth
def calculate_cash_flow():
    try:
        user = request.current_user
        data = request.json
        
        # Parâmetros da projeção
        years = data.get('years', 10)
        monthly_income = data.get('monthly_income', 0)
        monthly_expenses = data.get('monthly_expenses', 0)
        monthly_savings = data.get('monthly_savings', 0)
        inflation_rate = data.get('inflation_rate', 4.5) / 100
        investment_return = data.get('investment_return', 10.0) / 100
        
        # Calcular projeção de fluxo de caixa
        projections = []
        current_savings = 0
        
        for year in range(1, years + 1):
            # Aplicar inflação aos gastos
            adjusted_expenses = monthly_expenses * ((1 + inflation_rate) ** year)
            
            # Renda anual (assumindo crescimento com inflação)
            annual_income = monthly_income * 12 * ((1 + inflation_rate) ** year)
            annual_expenses = adjusted_expenses * 12
            annual_savings = monthly_savings * 12
            
            # Calcular poupança com juros compostos
            current_savings = (current_savings + annual_savings) * (1 + investment_return)
            
            projections.append({
                'year': year,
                'annual_income': round(annual_income, 2),
                'annual_expenses': round(annual_expenses, 2),
                'annual_savings': round(annual_savings, 2),
                'accumulated_savings': round(current_savings, 2),
                'net_cash_flow': round(annual_income - annual_expenses, 2)
            })
        
        # Salvar projeção no banco de dados
        projection = CashFlowProjection(
            user_id=user.id,
            projection_name=data.get('name', f'Projeção {years} anos'),
            projection_data=json.dumps(projections)
        )
        
        db.session.add(projection)
        db.session.commit()
        
        return jsonify({
            'message': 'Cash flow projection calculated successfully',
            'projections': projections,
            'projection_id': projection.id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/projections', methods=['GET'])
@require_auth
def get_projections():
    try:
        user = request.current_user
        projections = CashFlowProjection.query.filter_by(user_id=user.id).all()
        return jsonify([projection.to_dict() for projection in projections]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/projections/<int:projection_id>', methods=['DELETE'])
@require_auth
def delete_projection(projection_id):
    try:
        user = request.current_user
        
        projection = CashFlowProjection.query.filter_by(id=projection_id, user_id=user.id).first()
        if not projection:
            return jsonify({'error': 'Projection not found'}), 404
        
        db.session.delete(projection)
        db.session.commit()
        
        return jsonify({'message': 'Projection deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

