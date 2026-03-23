"""
Tests for Monitoring Service
"""

import pytest
from fastapi.testclient import TestClient
from app.core.monitoring import (
    get_health_status,
    get_database_health,
    get_cache_health,
    get_system_metrics,
    get_process_metrics
)

class TestHealthChecks:
    """Test health check endpoints"""
    
    def test_health_status(self):
        """Test overall health status"""
        health = get_health_status()
        
        assert health["status"] == "healthy"
        assert "timestamp" in health
        assert health["version"] == "3.0.0"
    
    def test_database_health(self):
        """Test database health check"""
        db_health = get_database_health()
        
        assert "status" in db_health
        assert "response_time_ms" in db_health
    
    def test_cache_health(self):
        """Test cache health check"""
        cache_health = get_cache_health()
        
        assert "status" in cache_health
        # Status can be healthy or unhealthy depending on Redis availability

class TestMetrics:
    """Test metrics collection"""
    
    def test_system_metrics(self):
        """Test system metrics"""
        metrics = get_system_metrics()
        
        assert "cpu_percent" in metrics
        assert "memory_percent" in metrics
        assert "disk_percent" in metrics
        assert "timestamp" in metrics
        
        # Values should be in valid ranges
        assert 0 <= metrics["cpu_percent"] <= 100
        assert 0 <= metrics["memory_percent"] <= 100
        assert 0 <= metrics["disk_percent"] <= 100
    
    def test_process_metrics(self):
        """Test process metrics"""
        metrics = get_process_metrics()
        
        assert "pid" in metrics
        assert "cpu_percent" in metrics
        assert "memory_mb" in metrics
        assert "threads" in metrics
        
        # PID should be positive
        assert metrics["pid"] > 0
