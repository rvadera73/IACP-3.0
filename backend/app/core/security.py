"""
Security Service for IACP 3.0
Rate limiting, CORS, XSS, CSRF, SQL injection prevention
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware
import re
import html
import secrets

# ============ Rate Limiting ============

limiter = Limiter(key_func=get_remote_address)

def setup_rate_limiting(app: FastAPI):
    """Setup rate limiting middleware"""
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ============ CORS Hardening ============

def setup_cors(app: FastAPI):
    """Setup hardened CORS"""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",  # Frontend dev
            "http://localhost:8080",  # Alternative frontend
            "https://iacp.dol.gov",   # Production
        ],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["Authorization", "Content-Type"],
        expose_headers=["X-Request-ID"],
        max_age=600,  # 10 minutes
    )

# ============ XSS Protection ============

class XSSProtectionMiddleware(BaseHTTPMiddleware):
    """Middleware to prevent XSS attacks"""
    
    async def dispatch(self, request: Request, call_next):
        # Sanitize query parameters
        sanitized_params = {}
        for key, value in request.query_params.items():
            sanitized_params[key] = html.escape(value)
        
        request.query_params = sanitized_params
        
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        
        return response

# ============ SQL Injection Prevention ============

SQL_INJECTION_PATTERNS = [
    r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)",
    r"(--)|(;)|(\/\*)|(\*\/)",
    r"(\b(OR|AND)\b\s+\d+\s*=\s*\d+)",
]

def check_sql_injection(value: str) -> bool:
    """Check if value contains SQL injection patterns"""
    for pattern in SQL_INJECTION_PATTERNS:
        if re.search(pattern, value, re.IGNORECASE):
            return True
    return False

class SQLInjectionProtectionMiddleware(BaseHTTPMiddleware):
    """Middleware to prevent SQL injection"""
    
    async def dispatch(self, request: Request, call_next):
        # Check query parameters
        for key, value in request.query_params.items():
            if check_sql_injection(value):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid input detected"
                )
        
        # Check path parameters
        for key, value in request.path_params.items():
            if isinstance(value, str) and check_sql_injection(value):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid input detected"
                )
        
        return await call_next(request)

# ============ CSRF Protection ============

class CSRFProtectionMiddleware(BaseHTTPMiddleware):
    """Middleware to prevent CSRF attacks"""
    
    async def dispatch(self, request: Request, call_next):
        # Skip CSRF for safe methods
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return await call_next(request)
        
        # Check CSRF token for state-changing methods
        csrf_token = request.headers.get("X-CSRF-Token")
        
        if not csrf_token:
            raise HTTPException(
                status_code=403,
                detail="CSRF token missing"
            )
        
        # Validate token (implement proper validation)
        # For now, just check it exists and is 32+ chars
        if len(csrf_token) < 32:
            raise HTTPException(
                status_code=403,
                detail="Invalid CSRF token"
            )
        
        return await call_next(request)

def generate_csrf_token() -> str:
    """Generate CSRF token"""
    return secrets.token_urlsafe(32)

# ============ Security Headers ============

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        return response

# ============ Input Validation ============

def validate_input(value: str, max_length: int = 1000, allow_html: bool = False) -> str:
    """Validate and sanitize input"""
    if not value:
        raise HTTPException(status_code=400, detail="Input required")
    
    if len(value) > max_length:
        raise HTTPException(status_code=400, detail=f"Input too long (max {max_length} chars)")
    
    if not allow_html:
        # Strip HTML tags
        value = html.escape(value)
    
    return value

# ============ Setup Function ============

def setup_security(app: FastAPI):
    """Setup all security features"""
    # Rate limiting
    setup_rate_limiting(app)
    
    # CORS
    setup_cors(app)
    
    # Middleware (order matters!)
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(XSSProtectionMiddleware)
    app.add_middleware(SQLInjectionProtectionMiddleware)
    app.add_middleware(CSRFProtectionMiddleware)
