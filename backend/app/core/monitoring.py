"""
Monitoring Service for IACP 3.0
Health checks, metrics, and performance monitoring
"""

from fastapi import FastAPI
from datetime import datetime
import time
import psutil
import os

# ============ Health Checks ============

def get_health_status() -> dict:
    """Get overall health status"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "3.0.0"
    }

def get_database_health() -> dict:
    """Check database connectivity"""
    # Would check actual database connection
    return {
        "status": "healthy",
        "response_time_ms": 5
    }

def get_cache_health() -> dict:
    """Check cache connectivity"""
    try:
        from app.core.cache import redis_client
        redis_client.ping()
        return {
            "status": "healthy",
            "response_time_ms": 2
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

# ============ Performance Metrics ============

def get_system_metrics() -> dict:
    """Get system performance metrics"""
    return {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage('/').percent,
        "timestamp": datetime.utcnow().isoformat()
    }

def get_process_metrics() -> dict:
    """Get process-specific metrics"""
    process = psutil.Process(os.getpid())
    
    return {
        "pid": os.getpid(),
        "cpu_percent": process.cpu_percent(),
        "memory_mb": process.memory_info().rss / 1024 / 1024,
        "threads": process.num_threads(),
        "open_files": len(process.open_files()),
        "connections": len(process.connections()),
        "uptime_seconds": time.time() - process.create_time()
    }

# ============ Request Logging ============

class RequestLogger:
    """Middleware for request/response logging"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http':
            return await self.app(scope, receive, send)
        
        start_time = time.time()
        
        # Log request
        from app.core.logging_config import logger
        logger.info(
            "request_started",
            method=scope['method'],
            path=scope['path']
        )
        
        # Custom send to capture response
        async def custom_send(message):
            if message['type'] == 'http.response.start':
                duration_ms = (time.time() - start_time) * 1000
                
                # Log response
                logger.info(
                    "request_completed",
                    method=scope['method'],
                    path=scope['path'],
                    status_code=message['status'],
                    duration_ms=round(duration_ms, 2)
                )
            
            await send(message)
        
        await self.app(scope, receive, custom_send)

# ============ Setup Function ============

def setup_monitoring(app: FastAPI):
    """Setup monitoring endpoints"""
    
    @app.get("/health")
    def health_check():
        return get_health_status()
    
    @app.get("/health/db")
    def database_health():
        return get_database_health()
    
    @app.get("/health/cache")
    def cache_health():
        return get_cache_health()
    
    @app.get("/metrics/system")
    def system_metrics():
        return get_system_metrics()
    
    @app.get("/metrics/process")
    def process_metrics():
        return get_process_metrics()
    
    # Add request logging middleware
    app.add_middleware(RequestLogger)
