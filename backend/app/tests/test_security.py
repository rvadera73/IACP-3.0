"""
Tests for Security Service
"""

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.core.security import (
    check_sql_injection,
    validate_input,
    generate_csrf_token,
    setup_security
)

class TestSQLInjection:
    """Test SQL injection prevention"""
    
    def test_clean_input(self):
        """Test clean input passes"""
        assert check_sql_injection("Robert Martinez") is False
        assert check_sql_injection("2026-BLA-00011") is False
    
    def test_select_injection(self):
        """Test SELECT injection detected"""
        assert check_sql_injection("'; SELECT * FROM users; --") is True
        assert check_sql_injection("1 OR 1=1") is True
    
    def test_drop_injection(self):
        """Test DROP injection detected"""
        assert check_sql_injection("'; DROP TABLE users; --") is True
    
    def test_union_injection(self):
        """Test UNION injection detected"""
        assert check_sql_injection("1 UNION SELECT * FROM users") is True

class TestInputValidation:
    """Test input validation"""
    
    def test_valid_input(self):
        """Test valid input passes"""
        result = validate_input("Robert Martinez")
        assert result == "Robert Martinez"
    
    def test_html_escaping(self):
        """Test HTML is escaped"""
        result = validate_input("<script>alert('xss')</script>")
        assert "<script>" not in result
        assert "&lt;script&gt;" in result
    
    def test_max_length(self):
        """Test max length enforcement"""
        with pytest.raises(Exception):
            validate_input("a" * 2000, max_length=1000)
    
    def test_empty_input(self):
        """Test empty input rejected"""
        with pytest.raises(Exception):
            validate_input("")

class TestCSRF:
    """Test CSRF protection"""
    
    def test_generate_csrf_token(self):
        """Test CSRF token generation"""
        token = generate_csrf_token()
        assert len(token) >= 32
        assert isinstance(token, str)
    
    def test_unique_tokens(self):
        """Test each token is unique"""
        token1 = generate_csrf_token()
        token2 = generate_csrf_token()
        assert token1 != token2

class TestSecurityHeaders:
    """Test security headers"""
    
    def test_security_headers_present(self):
        """Test security headers are added to responses"""
        app = FastAPI()
        setup_security(app)
        client = TestClient(app)
        
        @app.get("/test")
        def test_endpoint():
            return {"status": "ok"}
        
        response = client.get("/test")
        
        assert response.headers["X-XSS-Protection"] == "1; mode=block"
        assert response.headers["X-Content-Type-Options"] == "nosniff"
        assert "Content-Security-Policy" in response.headers

class TestCORS:
    """Test CORS configuration"""
    
    def test_allowed_origin(self):
        """Test allowed origins"""
        app = FastAPI()
        setup_security(app)
        client = TestClient(app)
        
        @app.get("/test")
        def test_endpoint():
            return {"status": "ok"}
        
        # Test localhost allowed
        response = client.get("/test", headers={"Origin": "http://localhost:3000"})
        assert response.status_code == 200

class TestRateLimiting:
    """Test rate limiting"""
    
    def test_rate_limit_applied(self):
        """Test rate limiting is applied"""
        app = FastAPI()
        setup_security(app)
        client = TestClient(app)
        
        @app.get("/test")
        def test_endpoint():
            return {"status": "ok"}
        
        # Make multiple requests (should not fail in tests)
        for _ in range(5):
            response = client.get("/test")
            assert response.status_code == 200
