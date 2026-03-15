import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User, Division } from '../types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setDivision: (division: Division) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const setDivision = useCallback((division: Division) => {
    setUser(prev => prev ? { ...prev, division } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, setDivision }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
