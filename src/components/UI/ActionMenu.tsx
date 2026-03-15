/**
 * Reusable ActionMenu Component
 * 
 * A consistent dropdown menu pattern for actions across all dashboards.
 * Follows HCD principles with clear visual hierarchy and keyboard accessibility.
 * 
 * Features:
 * - Hover or click to open
 * - Status-aware action filtering
 * - Color-coded action items
 * - Context information panel
 * - Keyboard navigation support
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Eye, CheckCircle, Send, ArrowRight, MoreVertical, AlertCircle, X } from 'lucide-react';
import { Button, Badge } from '../UI';

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  dividerAfter?: boolean;
  condition?: boolean; // Show/hide based on condition
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  defaultAction?: ActionMenuItem;
  contextInfo?: {
    label: string;
    value: string | React.ReactNode;
  }[];
  align?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

export default function ActionMenu({
  items,
  defaultAction,
  contextInfo,
  align = 'right',
  size = 'md',
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Filter items based on condition
  const visibleItems = items.filter(item => item.condition !== false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleActionClick = (item: ActionMenuItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'text-blue-700 hover:bg-blue-50';
      case 'success':
        return 'text-emerald-700 hover:bg-emerald-50';
      case 'warning':
        return 'text-amber-700 hover:bg-amber-50';
      case 'error':
        return 'text-red-700 hover:bg-red-50';
      default:
        return 'text-slate-700 hover:bg-slate-50';
    }
  };

  const getIconColor = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'text-blue-600';
      case 'success':
        return 'text-emerald-600';
      case 'warning':
        return 'text-amber-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-slate-400';
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
  };

  return (
    <div
      ref={menuRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <Button
        variant="outline"
        size={size === 'lg' ? 'md' : 'sm'}
        className="flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {defaultAction ? (
          <>
            {defaultAction.icon}
            <span>{defaultAction.label}</span>
          </>
        ) : (
          <>
            <span>Actions</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            <div className="py-1">
              {visibleItems.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <button
                    onClick={() => handleActionClick(item)}
                    disabled={item.disabled}
                    className={`w-full flex items-center gap-3 ${sizeClasses.md} transition-colors ${
                      item.disabled
                        ? 'text-slate-300 cursor-not-allowed'
                        : getVariantStyles(item.variant || 'default')
                    }`}
                  >
                    {item.icon && (
                      <span className={item.disabled ? '' : getIconColor(item.variant || 'default')}>
                        {item.icon}
                      </span>
                    )}
                    <span className={item.disabled ? '' : 'font-medium'}>{item.label}</span>
                  </button>
                  {item.dividerAfter && idx < visibleItems.length - 1 && (
                    <div className="border-t border-slate-100 my-1" data-testid="divider" />
                  )}
                </React.Fragment>
              ))}

              {/* Context Info Panel */}
              {contextInfo && contextInfo.length > 0 && (
                <div className="border-t border-slate-100 mt-1 pt-2 px-3 py-2 bg-slate-50">
                  {contextInfo.map((info, idx) => (
                    <div key={idx} className="mb-2 last:mb-0">
                      <div className="text-xs text-slate-500 font-medium mb-1">{info.label}</div>
                      <div className="text-sm">{info.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Pre-configured action item creators for common patterns
export const ActionItems = {
  viewCase: (onClick: () => void): ActionMenuItem => ({
    id: 'view-case',
    label: 'View Case',
    icon: <Eye className="w-4 h-4" />,
    onClick,
    variant: 'default',
  }),

  autoDocket: (onClick: () => void): ActionMenuItem => ({
    id: 'auto-docket',
    label: 'Auto-Docket',
    icon: <CheckCircle className="w-4 h-4" />,
    onClick,
    variant: 'success',
  }),

  sendDeficiency: (onClick: () => void): ActionMenuItem => ({
    id: 'send-deficiency',
    label: 'Send Deficiency Notice',
    icon: <Send className="w-4 h-4" />,
    onClick,
    variant: 'warning',
  }),

  assignToJudge: (onClick: () => void): ActionMenuItem => ({
    id: 'assign-judge',
    label: 'Assign to Judge',
    icon: <ArrowRight className="w-4 h-4" />,
    onClick,
    variant: 'primary',
  }),

  scheduleHearing: (onClick: () => void): ActionMenuItem => ({
    id: 'schedule-hearing',
    label: 'Schedule Hearing',
    icon: <CheckCircle className="w-4 h-4" />,
    onClick,
    variant: 'success',
  }),

  editDraft: (onClick: () => void): ActionMenuItem => ({
    id: 'edit-draft',
    label: 'Edit Draft',
    icon: <CheckCircle className="w-4 h-4" />,
    onClick,
    variant: 'primary',
  }),

  signRelease: (onClick: () => void): ActionMenuItem => ({
    id: 'sign-release',
    label: 'Sign & Release',
    icon: <CheckCircle className="w-4 h-4" />,
    onClick,
    variant: 'success',
  }),
};
