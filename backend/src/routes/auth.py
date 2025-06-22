from flask import Blueprint, jsonify, request
from src.models.user import User, db
from src.models.financial import FinancialProfile
from functools import wraps

auth_bp = Blueprint('auth', __name__)

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        access_key = request.headers.get('Authorization')
        if not access_key:
            return jsonify({'error': 'Access key required'}), 401
        
        if access_key.startswith('Bearer '):
            access_key = access_key[7:]
        
        user = User.query.filter_by(access_key=access_key, is_active=True).first()
        if not user:
            return jsonify({'error': 'Invalid access key'}), 401
        
        request.current_user = user
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        # Verificar se os campos obrigatórios estão presentes
        if not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Username, email and password are required'}), 400
        
        # Verificar se o usuário já existe
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Criar novo usuário
        user = User(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Criar perfil financeiro padrão
        financial_profile = FinancialProfile(user_id=user.id)
        db.session.add(financial_profile)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        user = User.query.filter_by(username=data['username']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is inactive'}), 401
        
        return jsonify({
            'message': 'Login successful',
            'access_key': user.access_key,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@require_auth
def get_profile():
    try:
        user = request.current_user
        return jsonify({
            'user': user.to_dict(),
            'financial_profile': user.financial_profile.to_dict() if user.financial_profile else None
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@require_auth
def update_profile():
    try:
        user = request.current_user
        data = request.json
        
        # Atualizar dados do usuário
        if 'email' in data:
            # Verificar se o email já existe para outro usuário
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'error': 'Email already exists'}), 400
            user.email = data['email']
        
        if 'password' in data:
            user.password_hash = user.hash_password(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/validate', methods=['GET'])
@require_auth
def validate_key():
    try:
        user = request.current_user
        return jsonify({
            'valid': True,
            'user': user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

