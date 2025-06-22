from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class ApiKey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    key_name = db.Column(db.String(100), nullable=False)
    api_key = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'key_name': self.key_name,
            'api_key': self.api_key[:8] + '...',  # Mostrar apenas os primeiros 8 caracteres
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }

class FinancialProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    monthly_income = db.Column(db.Float, default=0.0)
    monthly_expenses = db.Column(db.Float, default=0.0)
    monthly_savings = db.Column(db.Float, default=0.0)
    inflation_rate = db.Column(db.Float, default=4.5)  # Taxa de inflação padrão
    investment_return_rate = db.Column(db.Float, default=10.0)  # Taxa de retorno de investimento padrão
    education_type = db.Column(db.String(50), default='public')  # public, private, international
    housing_cost = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'monthly_income': self.monthly_income,
            'monthly_expenses': self.monthly_expenses,
            'monthly_savings': self.monthly_savings,
            'inflation_rate': self.inflation_rate,
            'investment_return_rate': self.investment_return_rate,
            'education_type': self.education_type,
            'housing_cost': self.housing_cost,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class MonthlyExpense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    amount = db.Column(db.Float, nullable=False)
    is_recurring = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category': self.category,
            'description': self.description,
            'amount': self.amount,
            'is_recurring': self.is_recurring,
            'created_at': self.created_at.isoformat()
        }

class Investment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    investment_type = db.Column(db.String(100), nullable=False)  # stocks, bonds, savings, etc.
    name = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    expected_return = db.Column(db.Float, default=0.0)
    risk_level = db.Column(db.String(20), default='medium')  # low, medium, high
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'investment_type': self.investment_type,
            'name': self.name,
            'amount': self.amount,
            'expected_return': self.expected_return,
            'risk_level': self.risk_level,
            'created_at': self.created_at.isoformat()
        }

class CashFlowProjection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    projection_name = db.Column(db.String(255), nullable=False)
    projection_data = db.Column(db.Text)  # JSON string com dados da projeção
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'projection_name': self.projection_name,
            'projection_data': json.loads(self.projection_data) if self.projection_data else {},
            'created_at': self.created_at.isoformat()
        }

