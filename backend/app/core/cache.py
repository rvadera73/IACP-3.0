"""
Cache Service for IACP 3.0
Redis caching layer for performance optimization
"""

import json
import redis
from functools import wraps
from typing import Any, Optional
import hashlib

# Redis connection
redis_client = redis.Redis(
    host='localhost',
    port=6379,
    db=0,
    decode_responses=True,
    socket_connect_timeout=5
)

def cache(key_prefix: str, timeout: int = 300):
    """
    Cache decorator for functions
    Args:
        key_prefix: Prefix for cache key
        timeout: Cache TTL in seconds (default: 5 minutes)
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            key_data = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            key_hash = hashlib.md5(key_data.encode()).hexdigest()
            cache_key = f"{key_prefix}:{key_hash}"
            
            # Try to get from cache
            try:
                cached = redis_client.get(cache_key)
                if cached:
                    return json.loads(cached)
            except redis.RedisError:
                # If Redis fails, continue without caching
                pass
            
            # Execute function
            result = func(*args, **kwargs)
            
            # Store in cache
            try:
                redis_client.setex(
                    cache_key,
                    timeout,
                    json.dumps(result)
                )
            except redis.RedisError:
                # If Redis fails, continue without caching
                pass
            
            return result
        return wrapper
    return decorator

def invalidate_cache(key_prefix: str):
    """Invalidate all cache keys with given prefix"""
    try:
        keys = redis_client.keys(f"{key_prefix}:*")
        if keys:
            redis_client.delete(*keys)
    except redis.RedisError:
        pass

# Cache helpers for specific use cases

def cache_case(case_number: str, timeout: int = 600):
    """Cache case data for 10 minutes"""
    return cache(key_prefix=f"case:{case_number}", timeout=timeout)

def cache_user(user_id: str, timeout: int = 1800):
    """Cache user data for 30 minutes"""
    return cache(key_prefix=f"user:{user_id}", timeout=timeout)

def cache_query(query_type: str, timeout: int = 300):
    """Cache query results for 5 minutes"""
    return cache(key_prefix=f"query:{query_type}", timeout=timeout)
