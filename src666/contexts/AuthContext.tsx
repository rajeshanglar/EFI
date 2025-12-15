import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';

interface User {
  email?: string;
  loginType?: 'membership' | 'conference';
  name?: string;
  token?: string;
  registration_type?: string; // From login API response
  [key: string]: any; // Allow additional properties from API
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAuthStatus: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    try {
      const result = await authService.login(credentials);
      
      if (result.success && result.user) {
        setIsAuthenticated(true);
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      console.log('=== AUTH CONTEXT: LOGGED OUT ===');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Refresh auth status - useful after login/logout operations
  const refreshAuthStatus = async () => {
    await checkAuthStatus();
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    refreshAuthStatus,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

