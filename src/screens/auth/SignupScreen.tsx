import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ScreenName } from '../../types/interfaces';
import AppContainer from '../../components/layout/AppContainer';

interface SignupScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigate }) => {
  const { signup, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    signup(email, password);
  };

  return (
    <AppContainer className="bg-indigo-50">
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl mt-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Criar Conta</h2>
        
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
            label="Senha (Mínimo 6 caracteres)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          
          <Button type="submit" loading={loading} className="w-full mt-6">
            Cadastrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?
          <Button
            variant="link"
            onClick={() => onNavigate('Login')}
            className="ml-1"
            disabled={loading}
          >
            Fazer Login
          </Button>
        </p>
      </div>
    </AppContainer>
  );
};

export default SignupScreen;