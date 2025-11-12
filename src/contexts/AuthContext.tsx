import React, { createContext, useContext } from 'react';
import { Auth } from 'firebase/auth';
import { useAuthService, AuthServiceResult } from '../services/useAuthService';

// Define o valor padrão para o Contexto
const AuthContext = createContext<AuthServiceResult | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
  auth: Auth | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, auth }) => {
  const service = useAuthService(auth); 
  return <AuthContext.Provider value={service}>{children}</AuthContext.Provider>;
};