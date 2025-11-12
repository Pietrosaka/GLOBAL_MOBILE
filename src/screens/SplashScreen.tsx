import React, { useEffect } from 'react';
// CORREÇÃO: Adicionando a extensão do arquivo (.tsx) para garantir que seja resolvido corretamente no ambiente.
import { useAuth } from '../contexts/AuthContext.tsx'; 
import { ScreenName } from '../types/interfaces';

interface SplashScreenProps {
  onAuthComplete: (screen: ScreenName) => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAuthComplete }) => {
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (isReady) {
      // Se a autenticação estiver pronta, decide para onde navegar
      if (user?.email) {
        onAuthComplete('Home');
      } else {
        onAuthComplete('Login');
      }
    }
  }, [isReady, user, onAuthComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-600 p-4">
      <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-2xl">
        <svg className="animate-pulse h-12 w-12 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H7l5 5-5 5H7" /> 
        </svg>
        <h1 className="mt-4 text-4xl font-extrabold text-indigo-700">Futuro do Trabalho Hub</h1>
        <p className="mt-2 text-lg text-gray-500">Carregando dados de autenticação...</p>
      </div>
    </div>
  );
};

export default SplashScreen;