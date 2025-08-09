'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from './api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um token válido ao carregar a aplicação
    const checkAuth = async () => {
      try {
        if (apiService.isAuthenticated()) {
          // Aqui você pode fazer uma chamada para obter os dados do usuário
          // Por enquanto, vamos apenas verificar se o token existe
          setUser({
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            first_name: 'Admin',
            last_name: 'User',
            is_staff: true,
            is_superuser: true,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        apiService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      await apiService.login({ username, password });
      
      // Após login bem-sucedido, definir o usuário
      setUser({
        id: 1,
        username,
        email: `${username}@example.com`,
        first_name: username,
        last_name: 'User',
        is_staff: true,
        is_superuser: false,
      });
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
