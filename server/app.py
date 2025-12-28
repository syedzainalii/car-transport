from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
import random
import string
from datetime import datetime, UTC, timedelta
from functools import wraps
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# CORS Configuration - Allow Next.js frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# App Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:postgres@db:5432/postgres"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Email Configuration
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', os.environ.get('MAIL_USERNAME'))

# Initialize extensions
db = SQLAlchemy(app)
mail = Mail(app)

# ============================================================================
# DATABASE MODELS
# ============================================================================

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default='user', server_default='user') 
    is_verified = db.Column(db.Boolean, default=False)

    # --- ADD THESE 4 LINES (The "Step 3" Fix) ---
    verification_code = db.Column(db.String(6), nullable=True)
    code_expires_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    # --------------------------------------------

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'status': self.status,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def generate_verification_code():
    """Generate a 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=6))

def send_verification_email(email, code, name):
    """Send verification code via email"""
    try:
        msg = Message(
            subject='Verify Your Email Address',
            recipients=[email]
        )
        msg.html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .code-box {{ background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }}
                .code {{ font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; }}
                .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #999; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Email Verification</h1>
                </div>
                <div class="content">
                    <h2>Hello, {name}! 👋</h2>
                    <p>Thank you for registering. Please use the verification code below to verify your email address:</p>
                    <div class="code-box">
                        <div class="code">{code}</div>
                    </div>
                    <p><strong>Important:</strong> This code will expire in 10 minutes.</p>
                    <p>If you didn't request this verification, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>This is an automated email. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        """
        mail.send(msg)
        return True
    except Exception as e:
        print(f"❌ Email Error: {str(e)}")
        return False

def generate_token(user): # Change user_id to user object
    """Generate JWT token"""
    payload = {
        'user_id': user.id,
        'status': user.status, # Add this
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    """Decorator to protect routes with JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({'success': False, 'message': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'success': False, 'message': 'Token is missing'}), 401
        
        try:
            # Decode token
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(payload['user_id'])
            
            if not current_user:
                return jsonify({'success': False, 'message': 'User not found'}), 401
            
            if not current_user.is_verified:
                return jsonify({'success': False, 'message': 'Email not verified'}), 403
                
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401
        except Exception as e:
            return jsonify({'success': False, 'message': 'Authentication failed'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# ============================================================================
# ROUTES
# ============================================================================

@app.route('/', methods=['GET'])
def index():
    """API Information"""
    return jsonify({
        'success': True,
        'message': 'Flask Authentication API',
        'version': '2.0',
        'endpoints': {
            'auth': {
                'register': 'POST /api/auth/register',
                'verify-email': 'POST /api/auth/verify-email',
                'resend-code': 'POST /api/auth/resend-code',
                'login': 'POST /api/auth/login'
            },
            'protected': {
                'dashboard': 'GET /api/dashboard'
            }
        }
    }), 200

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user and send verification code"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not name or not email or not password:
            return jsonify({'success': False, 'message': 'Name, email, and password are required'}), 400
        
        if len(password) < 6:
            return jsonify({'success': False, 'message': 'Password must be at least 6 characters'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            if existing_user.is_verified:
                return jsonify({'success': False, 'message': 'Email already registered'}), 409
            else:
                # User registered but not verified - resend code
                verification_code = generate_verification_code()
                existing_user.verification_code = verification_code
                existing_user.code_expires_at = datetime.utcnow() + timedelta(minutes=10)
                db.session.commit()
                
                send_verification_email(email, verification_code, name)
                
                return jsonify({
                    'success': True,
                    'message': 'Verification code sent to your email',
                    'email': email
                }), 200
        
        # Create new user
        verification_code = generate_verification_code()
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        
        new_user = User(
            name=name,
            email=email,
            password=hashed_password,
            verification_code=verification_code,
            code_expires_at=datetime.utcnow() + timedelta(minutes=10)
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Send verification email
        email_sent = send_verification_email(email, verification_code, name)
        
        return jsonify({
            'success': True,
            'message': 'Registration successful. Verification code sent to your email.',
            'email': email,
            'email_sent': email_sent
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Register Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Registration failed. Please try again.'}), 500

@app.route('/api/auth/verify-email', methods=['POST'])
def verify_email():
    """Verify email with code"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        code = data.get('code', '').strip()
        
        if not email or not code:
            return jsonify({'success': False, 'message': 'Email and verification code are required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        if user.is_verified:
            return jsonify({'success': False, 'message': 'Email already verified'}), 400
        
        # Check if code expired
        if not user.code_expires_at or user.code_expires_at < datetime.utcnow():
            return jsonify({'success': False, 'message': 'Verification code has expired'}), 400
        
        # Verify code
        if user.verification_code != code:
            return jsonify({'success': False, 'message': 'Invalid verification code'}), 400
        
        # Mark as verified
        user.is_verified = True
        user.verification_code = None
        user.code_expires_at = None
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate token
        token = generate_token(user)
        
        return jsonify({
            'success': True,
            'message': 'Email verified successfully',
            'token': token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Verify Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Verification failed'}), 500

@app.route('/api/auth/resend-code', methods=['POST'])
def resend_code():
    """Resend verification code"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        if user.is_verified:
            return jsonify({'success': False, 'message': 'Email already verified'}), 400
        
        # Generate new code
        verification_code = generate_verification_code()
        user.verification_code = verification_code
        user.code_expires_at = datetime.utcnow() + timedelta(minutes=10)
        db.session.commit()
        
        # Send email
        email_sent = send_verification_email(email, verification_code, user.name)
        
        if email_sent:
            return jsonify({'success': True, 'message': 'Verification code sent successfully'}), 200
        else:
            return jsonify({'success': False, 'message': 'Failed to send email'}), 500
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Resend Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to resend code'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not check_password_hash(user.password, password):
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        
        # Check if verified
        if not user.is_verified:
            return jsonify({
                'success': False,
                'message': 'Please verify your email before logging in',
                'email_verified': False
            }), 403
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate token
        token = generate_token(user)
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"❌ Login Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Login failed'}), 500

# ============================================================================
# PROTECTED ENDPOINTS
# ============================================================================

@app.route('/api/dashboard', methods=['GET'])
@token_required
def dashboard(current_user):
    """Get dashboard data - Protected route"""
    try:
        return jsonify({
            'success': True,
            'message': 'Dashboard data retrieved successfully',
            'user': current_user.to_dict(),
            'stats': {
                'total_users': User.query.count(),
                'verified_users': User.query.filter_by(is_verified=True).count()
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Dashboard Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to load dashboard'}), 500

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'success': False, 'message': 'Internal server error'}), 500

# ============================================================================
# INITIALIZE DATABASE
# ============================================================================

with app.app_context():
    db.create_all()
    print("✅ Database initialized successfully")

# ============================================================================
# RUN APPLICATION
# ============================================================================

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Flask Authentication API Server")
    print("="*50)
    print(f"📍 Server: http://localhost:4000")
    print(f"📚 API Docs: http://localhost:4000/")
    print(f"💚 Health Check: http://localhost:4000/api/health")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=4000, debug=True)