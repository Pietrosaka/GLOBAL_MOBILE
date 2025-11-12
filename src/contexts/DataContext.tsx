import React, { createContext, useContext } from 'react';
// CORREÇÃO 1: Importação nomeada e com extensão de arquivo
import { useDataService } from '../services/useDataService.ts'; 
import { DataContextType } from '../types/interfaces';
// CORREÇÃO 2: Importação com extensão de arquivo
import { useAuth } from './AuthContext.tsx'; 

// Criação do Contexto
const DataContext = createContext<DataContextType | undefined>(undefined);

// Hook para usar o Contexto de Dados
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};

// Componente Provedor de Dados
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isReady } = useAuth();
  
  // O hook de serviço de dados só é ativado se a autenticação estiver pronta
  const { articles, polls, dataLoading, dataError, saveArticle, deleteArticle, votePoll } = 
    useDataService(isReady ? user?.uid || null : null);

  const contextValue: DataContextType = {
    articles,
    polls,
    dataLoading,
    dataError,
    saveArticle,
    deleteArticle,
    // Lógica para votação:
    votePoll: (pollId: string, optionId: string) => {
        if (!user?.uid) {
            return Promise.reject(new Error("Usuário não logado para votar."));
        }
        // CORREÇÃO 3 (Lógica): Passa o user.uid para o serviço, que é necessário para impedir votos duplicados.
        return votePoll(pollId, optionId, user.uid);
    }
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};