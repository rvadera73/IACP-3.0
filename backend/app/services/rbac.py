"""
RBAC Service for IACP 3.0
PyCasbin-based Role-Based Access Control

Usage:
    from app.services.rbac import enforcer, check_permission
    
    # Check if user has permission
    if check_permission(user_id, "case", "read"):
        # Allow access
        pass
"""

import casbin
import os
from functools import wraps
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer

# Initialize enforcer with model and policy
RBAC_MODEL_PATH = os.path.join(os.path.dirname(__file__), "rbac_model.conf")
RBAC_POLICY_PATH = os.path.join(os.path.dirname(__file__), "rbac_policy.csv")

# Create enforcer
enforcer = casbin.Enforcer(RBAC_MODEL_PATH, RBAC_POLICY_PATH)

# Security scheme
security = HTTPBearer()

# Role permissions matrix
ROLE_PERMISSIONS = {
    # OALJ Roles
    "docket_clerk": [
        ("case", "read"),
        ("case", "docket"),
        ("case", "assign"),
        ("filing", "read"),
        ("filing", "accept"),
        ("judge", "list"),
    ],
    "legal_assistant": [
        ("case", "read"),
        ("hearing", "create"),
        ("hearing", "schedule"),
        ("reporter", "list"),
    ],
    "attorney_advisor": [
        ("case", "read"),
        ("decision", "draft"),
        ("decision", "edit"),
        ("research", "access"),
    ],
    "alj": [
        ("case", "read"),
        ("case", "write"),
        ("decision", "draft"),
        ("decision", "sign"),
        ("decision", "seal"),
        ("hearing", "conduct"),
        ("document", "seal"),
    ],
    
    # Boards Roles
    "board_docket_clerk": [
        ("case", "read"),
        ("case", "docket"),
        ("appeal", "process"),
        ("record", "transmit"),
    ],
    "board_legal_assistant": [
        ("case", "read"),
        ("hearing", "schedule"),
        ("oral_argument", "schedule"),
    ],
    "board_attorney_advisor": [
        ("case", "read"),
        ("brief", "review"),
        ("memo", "draft"),
        ("precedent", "search"),
    ],
    "board_member": [
        ("case", "read"),
        ("case", "decide"),
        ("panel", "review"),
        ("decision", "sign"),
        ("dissent", "write"),
    ],
}

def init_policies():
    """Initialize default policies for all roles"""
    for role, permissions in ROLE_PERMISSIONS.items():
        for obj, act in permissions:
            # Add policy if not exists
            if not enforcer.has_policy(role, obj, act):
                enforcer.add_policy(role, obj, act)
    
    # Save policy to file
    enforcer.save_policy()

def add_role_for_user(user_id: str, role: str):
    """Assign role to user"""
    enforcer.add_role_for_user(user_id, role)

def get_user_roles(user_id: str) -> list:
    """Get all roles for user"""
    return enforcer.get_roles_for_user(user_id)

def check_permission(user_id: str, obj: str, act: str) -> bool:
    """Check if user has permission"""
    # Get user's roles
    roles = get_user_roles(user_id)
    
    # Check each role
    for role in roles:
        if enforcer.enforce(role, obj, act):
            return True
    
    return False

def require_permission(obj: str, act: str):
    """Decorator to require permission for endpoint"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get user from request
            # This will be integrated with auth
            user_id = kwargs.get("user_id")
            
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User ID required"
                )
            
            # Check permission
            if not check_permission(user_id, obj, act):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission denied: {act} {obj}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# Initialize policies on import
init_policies()
