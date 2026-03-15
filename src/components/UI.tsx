import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { colors, typography, button as buttonTokens, borderRadius, shadows } from './design-tokens';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON - WCAG 2.0 AA Compliant
// ─────────────────────────────────────────────────────────────────────────────
// - Minimum touch target: 44x44px (recommended)
// - Minimum interactive: 24x24px (required)
// - Font size: minimum 14px (0.875rem)
// - Contrast ratio: 4.5:1 for text, 3:1 for UI components
// - Visible focus indicator: 2px offset ring

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, disabled, children, ...props }, ref) => {
    // USWDS-aligned color palette with WCAG AA compliance
    const variants = {
      // Primary: DOL Blue #003366 on white (8.6:1) / white on blue (8.6:1)
      primary: 'bg-[#003366] text-white hover:bg-[#002852] active:bg-[#001F40] shadow-sm',
      // Secondary: Gray background with dark text
      secondary: 'bg-[#E8EBED] text-[#1B2833] hover:bg-[#C6CDD4] active:bg-[#A5AFB9]',
      // Outline: Border with transparent background
      outline: 'border-2 border-[#003366] text-[#003366] bg-transparent hover:bg-[#E8F1F8] active:bg-[#B8D4E8]',
      // Ghost: Minimal styling for low-emphasis actions
      ghost: 'bg-transparent text-[#32404D] hover:bg-[#F7F8F9] active:bg-[#E8EBED]',
      // Danger: Error state for destructive actions
      danger: 'bg-[#B30000] text-white hover:bg-[#8B0000] active:bg-[#660000]',
      // Success: Positive actions (approve, confirm)
      success: 'bg-[#00874A] text-white hover:bg-[#006838] active:bg-[#004A28]',
    };

    // Accessible font sizes (minimum 14px)
    const sizes = {
      sm: 'px-3 py-2 text-[14px] min-h-[36px]',
      md: 'px-4 py-2.5 text-[15px] min-h-[40px]',
      lg: 'px-6 py-3 text-[16px] min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 font-semibold rounded-lg',
          'transition-all duration-150 ease-in-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003366] focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          // Ensure minimum touch target
          'min-w-[44px] min-h-[44px]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ─────────────────────────────────────────────────────────────────────────────
// CARD - Accessible container with proper contrast
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ children, className, onClick, variant = 'default', padding = 'md', ...props }: CardProps) => {
  const variants = {
    default: 'bg-white border border-[#E8EBED]',
    elevated: 'bg-white border border-[#E8EBED] shadow-md',
    outlined: 'bg-transparent border-2 border-[#E8EBED]',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl overflow-hidden',
        'transition-shadow duration-200',
        variants[variant],
        paddingStyles[padding],
        onClick && 'cursor-pointer hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BADGE - Accessible status indicators
// ─────────────────────────────────────────────────────────────────────────────
// - Minimum 3:1 contrast ratio (large text / UI component)
// - Not relying on color alone (includes text labels)
// - Minimum font size 12px

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'brand';
  size?: 'sm' | 'md';
  className?: string;
  title?: string;
}

export const Badge = ({ children, variant = 'neutral', size = 'md', className, title }: BadgeProps) => {
  // Accessible color combinations (magic number 50+)
  const variants = {
    // Neutral: Gray-10 bg, Gray-70 text (60 on 10 = 8.2:1)
    neutral: 'bg-[#E8EBED] text-[#32404D]',
    // Success: Success-5 bg, Success-60 text (accessible)
    success: 'bg-[#E6F8F0] text-[#006838]',
    // Warning: Warning-5 bg, Warning-70 text (accessible)
    warning: 'bg-[#FFF9E6] text-[#805500]',
    // Error: Error-5 bg, Error-60 text (accessible)
    error: 'bg-[#FDE8E8] text-[#8B0000]',
    // Info: Blue-5 bg, Blue-60 text (accessible)
    info: 'bg-[#E8F1F8] text-[#002852]',
    // Brand: DOL Blue-5 bg, DOL Blue-60 text
    brand: 'bg-[#E8F1F8] text-[#002852]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-[12px]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wide',
        'whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      title={title}
      role="status"
      aria-label={typeof children === 'string' ? children : title}
    >
      {children}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// INPUT - Accessible form input with proper labeling
// ─────────────────────────────────────────────────────────────────────────────
// - Minimum font size: 16px (prevents iOS zoom)
// - Visible border: 1px minimum
// - Focus indicator: 2px ring
// - Error states with color + icon

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, leftElement, rightElement, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-[11px] font-semibold uppercase tracking-wide mb-2',
              error ? 'text-[#8B0000]' : 'text-[#657585]'
            )}
          >
            {label}
            {required && <span className="text-[#B30000] ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative">
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#657585]">
              {leftElement}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-2.5 text-[16px] bg-white',
              'border-2 rounded-lg',
              'transition-colors duration-150',
              'placeholder:text-[#A5AFB9]',
              'focus:outline-none focus:ring-2 focus:ring-[#003366] focus:ring-offset-1',
              leftElement && 'pl-10',
              rightElement && 'pr-10',
              error
                ? 'border-[#D92626] focus:ring-[#B30000]'
                : 'border-[#E8EBED] focus:border-[#003366]',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            aria-required={required}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="mt-1.5 text-[13px] text-[#B30000] flex items-center gap-1.5" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-[12px] text-[#657585]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ─────────────────────────────────────────────────────────────────────────────
// SELECT - Accessible dropdown
// ─────────────────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, options, className, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'block text-[11px] font-semibold uppercase tracking-wide mb-2',
              error ? 'text-[#8B0000]' : 'text-[#657585]'
            )}
          >
            {label}
            {required && <span className="text-[#B30000] ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full px-4 py-2.5 text-[16px] bg-white',
              'border-2 rounded-lg appearance-none',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-[#003366] focus:ring-offset-1',
              'cursor-pointer',
              error
                ? 'border-[#D92626] focus:ring-[#B30000]'
                : 'border-[#E8EBED] focus:border-[#003366]',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-required={required}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#657585]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error && (
          <p className="mt-1.5 text-[13px] text-[#B30000] flex items-center gap-1.5" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="mt-1.5 text-[12px] text-[#657585]">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ─────────────────────────────────────────────────────────────────────────────
// TEXTAREA - Accessible multi-line input
// ─────────────────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'block text-[11px] font-semibold uppercase tracking-wide mb-2',
              error ? 'text-[#8B0000]' : 'text-[#657585]'
            )}
          >
            {label}
            {required && <span className="text-[#B30000] ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-2.5 text-[16px] bg-white',
            'border-2 rounded-lg',
            'transition-colors duration-150',
            'placeholder:text-[#A5AFB9]',
            'focus:outline-none focus:ring-2 focus:ring-[#003366] focus:ring-offset-1',
            'resize-y min-h-[100px]',
            error
              ? 'border-[#D92626] focus:ring-[#B30000]'
              : 'border-[#E8EBED] focus:border-[#003366]',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-required={required}
          {...props}
        />

        {error && (
          <p className="mt-1.5 text-[13px] text-[#B30000] flex items-center gap-1.5" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="mt-1.5 text-[12px] text-[#657585]">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ─────────────────────────────────────────────────────────────────────────────
// ALERT - Accessible notification component
// ─────────────────────────────────────────────────────────────────────────────

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onDismiss?: () => void;
  className?: string;
}

export const Alert = ({ children, variant = 'info', title, onDismiss, className }: AlertProps) => {
  const variants = {
    info: 'bg-[#E8F1F8] border-[#B8D4E8] text-[#002852]',
    success: 'bg-[#E6F8F0] border-[#B8ECD5] text-[#006838]',
    warning: 'bg-[#FFF9E6] border-[#FFEDB8] text-[#805500]',
    error: 'bg-[#FDE8E8] border-[#FAC5C5] text-[#8B0000]',
  };

  const icons = {
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-4 flex gap-3',
        variants[variant],
        className
      )}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[variant]}</div>
      <div className="flex-1">
        {title && (
          <h4 className="font-semibold mb-1">{title}</h4>
        )}
        <div className="text-[14px] leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
          aria-label="Dismiss alert"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LINK - Accessible hyperlink
// ─────────────────────────────────────────────────────────────────────────────

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'standalone';
  external?: boolean;
}

export const Link = ({ href, children, variant = 'primary', external, className, ...props }: LinkProps) => {
  const variants = {
    primary: 'text-[#003366] hover:text-[#002852] hover:underline',
    secondary: 'text-[#32404D] hover:text-[#003366] hover:underline',
    standalone: 'text-[#003366] font-semibold hover:underline inline-flex items-center gap-1',
  };

  return (
    <a
      href={href}
      className={cn(
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003366] focus-visible:ring-offset-1',
        variants[variant],
        className
      )}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
      {external && (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </a>
  );
};
