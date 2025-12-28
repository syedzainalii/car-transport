from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  
from flask_mail import Mail, Message
from os import environ
from dotenv import load_dotenv
import jwt
import random
import string
from datetime import datetime, timedelta
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL', 'sqlite:///users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = environ.get('SECRET_KEY', 'your-secret-key-change-in-production')

# Email configuration
app.config['MAIL_SERVER'] = environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = environ.get('MAIL_DEFAULT_SENDER')

db = SQLAlchemy(app)
mail = Mail(app)

# User Model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    verification_code = db.Column(db.String(6), nullable=True)
    code_expires_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    def json(self):
        return {
            'id': self.id, 
            'name': self.name, 
            'email': self.email,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

# Initialize database
with app.app_context():
    db.create_all()

# Generate verification code
def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

# Send verification email
def send_verification_email(email, code, name):
    try:
        msg = Message(
            subject='Verify Your Email',
            recipients=[email]
        )
        msg.html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                    <h2 style="color: #333;">Hi {name}! 👋</h2>
                    <p style="font-size: 16px; color: #555;">Thank you for registering. Please verify your email address.</p>
                    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">{code}</h1>
                    </div>
                    <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes.</p>
                    <p style="font-size: 14px; color: #777;">If you didn't request this, please ignore this email.</p>
                </div>
            </body>
        </html>
        """
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

# Token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['user_id']).first()
            
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Register (Step 1: Create account and send verification code)
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({'message': 'Name, email and password are required'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already registered'}), 409
        
        # Generate verification code
        verification_code = generate_verification_code()
        code_expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        hashed_password = generate_password_hash(data['password'])
        
        new_user = User(
            name=data['name'],
            email=data['email'],
            password=hashed_password,
            is_verified=False,
            verification_code=verification_code,
            code_expires_at=code_expires_at
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Send verification email
        if send_verification_email(data['email'], verification_code, data['name']):
            return jsonify({
                'message': 'Registration successful. Please check your email for verification code.',
                'email': data['email'],
                'user_id': new_user.id
            }), 201
        else:
            return jsonify({
                'message': 'Registration successful but failed to send verification email. Please try resending.',
                'email': data['email'],
                'user_id': new_user.id
            }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error registering user', 'error': str(e)}), 500

# Verify Email (Step 2: Verify the code)
@app.route('/api/auth/verify-email', methods=['POST'])
def verify_email():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('code'):
            return jsonify({'message': 'Email and verification code are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if user.is_verified:
            return jsonify({'message': 'Email already verified'}), 400
        
        # Check if code expired
        if user.code_expires_at < datetime.utcnow():
            return jsonify({'message': 'Verification code has expired. Please request a new one.'}), 400
        
        # Verify code
        if user.verification_code != data['code']:
            return jsonify({'message': 'Invalid verification code'}), 400
        
        # Mark user as verified
        user.is_verified = True
        user.verification_code = None
        user.code_expires_at = None
        db.session.commit()
        
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'Email verified successfully',
            'token': token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'is_verified': user.is_verified
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error verifying email', 'error': str(e)}), 500

# Resend Verification Code
@app.route('/api/auth/resend-code', methods=['POST'])
def resend_code():
    try:
        data = request.get_json()
        
        if not data.get('email'):
            return jsonify({'message': 'Email is required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if user.is_verified:
            return jsonify({'message': 'Email already verified'}), 400
        
        # Generate new code
        verification_code = generate_verification_code()
        code_expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        user.verification_code = verification_code
        user.code_expires_at = code_expires_at
        db.session.commit()
        
        # Send email
        if send_verification_email(user.email, verification_code, user.name):
            return jsonify({'message': 'Verification code sent successfully'}), 200
        else:
            return jsonify({'message': 'Failed to send verification email'}), 500
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error resending code', 'error': str(e)}), 500

# Login
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Check if email is verified
        if not user.is_verified:
            return jsonify({
                'message': 'Please verify your email before logging in',
                'email_verified': False
            }), 403
        
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'is_verified': user.is_verified
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Error logging in', 'error': str(e)}), 500

# Get all users (protected)
@app.route('/api/users', methods=['GET'])
@token_required
def get_users(current_user):
    try:
        users = User.query.all()
        return jsonify([user.json() for user in users]), 200
    except Exception as e:
        return jsonify({'message': 'Error getting users', 'error': str(e)}), 500

# Update user (protected)
@app.route('/api/users/<id>', methods=['PUT'])
@token_required
def update_user(current_user, id):
    try:
        if current_user.id != int(id):
            return jsonify({'message': 'Unauthorized'}), 403
        
        user = User.query.filter_by(id=id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'message': 'Email already in use'}), 409
            user.email = data['email']
        if 'password' in data:
            user.password = generate_password_hash(data['password'])
        
        db.session.commit()
        return jsonify({'message': 'User updated', 'user': user.json()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating user', 'error': str(e)}), 500

# Delete user (protected)
@app.route('/api/users/<id>', methods=['DELETE'])
@token_required
def delete_user(current_user, id):
    try:
        if current_user.id != int(id):
            return jsonify({'message': 'Unauthorized'}), 403
        
        user = User.query.filter_by(id=id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error deleting user', 'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Flask Server Running on http://localhost:4000")
    print("📧 Email verification enabled")
    app.run(host='0.0.0.0', port=4000, debug=True)