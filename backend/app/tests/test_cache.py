"""
Tests for Cache Service
"""

import pytest
from app.core.cache import cache, invalidate_cache, redis_client

class TestCache:
    """Test caching functionality"""
    
    def test_cache_decorator(self):
        """Test cache decorator stores and retrieves values"""
        call_count = [0]
        
        @cache(key_prefix="test", timeout=60)
        def expensive_function(x, y):
            call_count[0] += 1
            return x + y
        
        # First call - should execute function
        result1 = expensive_function(5, 3)
        assert result1 == 8
        assert call_count[0] == 1
        
        # Second call with same args - should use cache
        result2 = expensive_function(5, 3)
        assert result2 == 8
        assert call_count[0] == 1  # Should not have increased
        
    def test_cache_different_args(self):
        """Test cache with different arguments"""
        call_count = [0]
        
        @cache(key_prefix="test2", timeout=60)
        def multiply(x, y):
            call_count[0] += 1
            return x * y
        
        result1 = multiply(2, 3)
        result2 = multiply(2, 4)
        
        assert result1 == 6
        assert result2 == 8
        assert call_count[0] == 2  # Should have been called twice

class TestCacheInvalidation:
    """Test cache invalidation"""
    
    def test_invalidate_cache(self):
        """Test cache invalidation clears keys"""
        # Set some cache values
        redis_client.setex("test_invalidate:abc", 60, "value1")
        redis_client.setex("test_invalidate:def", 60, "value2")
        
        # Invalidate
        invalidate_cache("test_invalidate")
        
        # Verify cleared
        assert redis_client.get("test_invalidate:abc") is None
        assert redis_client.get("test_invalidate:def") is None
