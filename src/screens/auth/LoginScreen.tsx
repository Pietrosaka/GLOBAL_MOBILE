import React, { useState } from 'react';
// CORREÇÃO: Ajustando os caminhos para serem mais robustos (usando '../' ao invés de '..//' se necessário)
// O nível correto para /src/screens/auth/ acessar /src/contexts/ ou /src/components/ui/ é '../../'

import { useAuth } from '../../contexts/AuthContext.tsx'; 
import Button from '../../components/ui/Button.tsx';
import Input from '../../components/ui/Input.tsx';
import { ScreenName } from '../../types/interfaces';
import AppContainer from '../../components/layout/AppContainer.tsx';

interface LoginScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate }) => {
  // Nota: Assumindo que o componente Button suporta a prop 'loading' e 'variant'
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    login(email, password);
  };

  return (
    <AppContainer className="bg-indigo-50">
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl mt-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Acesso ao Hub</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            id="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            id="password"
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {/* Adicionando prop 'disabled' para consistência, se 'loading' for verdadeiro */}
          <Button disabled={loading} onClick={() => handleSubmit} className="w-full mt-6">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Não tem uma conta?
          {/* Usando o botão HTML simples para navegação interna, para evitar conflito com Button.tsx que não é um link */}
          <button
            onClick={() => onNavigate('Signup')}
            className="ml-1 text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
            disabled={loading}
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </AppContainer>
  );
};

export default LoginScreen;