"""
Tests for RBAC Service
"""

import pytest
from app.services.rbac import (
    enforcer,
    add_role_for_user,
    get_user_roles,
    check_permission,
    ROLE_PERMISSIONS
)

class TestRBAC:
    """Test RBAC functionality"""
    
    def test_role_permissions_defined(self):
        """Test that all roles have permissions defined"""
        assert len(ROLE_PERMISSIONS) == 8
        
        # Check all 8 roles exist
        roles = [
            "docket_clerk",
            "legal_assistant",
            "attorney_advisor",
            "alj",
            "board_docket_clerk",
            "board_legal_assistant",
            "board_attorney_advisor",
            "board_member"
        ]
        
        for role in roles:
            assert role in ROLE_PERMISSIONS
            assert len(ROLE_PERMISSIONS[role]) > 0
    
    def test_add_role_for_user(self):
        """Test adding role to user"""
        user_id = "test-user-1"
        role = "docket_clerk"
        
        add_role_for_user(user_id, role)
        roles = get_user_roles(user_id)
        
        assert role in roles
    
    def test_get_user_roles(self):
        """Test getting user roles"""
        user_id = "test-user-2"
        role = "alj"
        
        add_role_for_user(user_id, role)
        roles = get_user_roles(user_id)
        
        assert len(roles) == 1
        assert role in roles
    
    def test_check_permission_docket_clerk(self):
        """Test docket clerk permissions"""
        user_id = "test-clerk-1"
        add_role_for_user(user_id, "docket_clerk")
        
        # Should have docket permission
        assert check_permission(user_id, "case", "docket") is True
        assert check_permission(user_id, "case", "assign") is True
        
        # Should NOT have judge permissions
        assert check_permission(user_id, "decision", "sign") is False
    
    def test_check_permission_alj(self):
        """Test ALJ permissions"""
        user_id = "test-judge-1"
        add_role_for_user(user_id, "alj")
        
        # Should have judge permissions
        assert check_permission(user_id, "decision", "sign") is True
        assert check_permission(user_id, "document", "seal") is True
        assert check_permission(user_id, "hearing", "conduct") is True
    
    def test_check_permission_board_member(self):
        """Test board member permissions"""
        user_id = "test-board-1"
        add_role_for_user(user_id, "board_member")
        
        # Should have board permissions
        assert check_permission(user_id, "case", "decide") is True
        assert check_permission(user_id, "panel", "review") is True
        
        # Should NOT have OALJ clerk permissions
        assert check_permission(user_id, "case", "docket") is False
    
    def test_multiple_roles(self):
        """Test user with multiple roles"""
        user_id = "test-multi-1"
        add_role_for_user(user_id, "docket_clerk")
        add_role_for_user(user_id, "legal_assistant")
        
        # Should have permissions from both roles
        assert check_permission(user_id, "case", "docket") is True
        assert check_permission(user_id, "hearing", "schedule") is True
    
    def test_no_permissions_without_role(self):
        """Test user without role has no permissions"""
        user_id = "test-no-role"
        
        # User with no role should have no permissions
        assert check_permission(user_id, "case", "read") is False
