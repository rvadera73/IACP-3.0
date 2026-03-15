import { expect, vi } from 'vitest';

// Mock window.alert
global.alert = vi.fn();

// Mock console methods
global.console = {
  ...global.console,
  error: vi.fn(),
  warn: vi.fn(),
};

// Test utilities
export function renderWithProviders(component: any) {
  // Mock render function
  return { component };
}

export function fireEvent(element: any, event: string) {
  if (element && element.props && element.props[event]) {
    element.props[event]();
  }
}

export function waitFor(callback: () => void, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      try {
        callback();
        clearInterval(interval);
        resolve(true);
      } catch (e) {
        // Continue waiting
      }
    }, 50);
    
    setTimeout(() => {
      clearInterval(interval);
      reject(new Error('Timeout'));
    }, timeout);
  });
}
