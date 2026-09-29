import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../../features/auth/types/auth.types';
import { USE_MOCK_API } from '../../constants/config';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'timee_pms_auth_user';
const JWT_STORAGE_KEY = 'timee_pms_jwt_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      
      // If mock API is enabled, fallback to default mock user for offline convenience
      if (USE_MOCK_API) {
        return {
          id: 'usr-101',
          username: 'arnold.smith',
          name: 'Arnold Smith',
          role: 'Payroll Administrator',
          employeeId: 'emp-101',
          employeeCode: 'SYS-ADMIN',
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const hasToken = Boolean(localStorage.getItem(JWT_STORAGE_KEY));
    if (hasToken) return true;
    
    // In mock API mode, assume authenticated if mock mode is on and no explicit logout happened
    if (USE_MOCK_API) return true;
    
    return false;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(JWT_STORAGE_KEY);
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = (userData: AuthUser, token: string) => {
    localStorage.setItem(JWT_STORAGE_KEY, token);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(JWT_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
