import React from 'react';
// Importação corrigida com a extensão
import Button from '../ui/Button'; 
import { useAuth } from '../../contexts/AuthContext';
import { ScreenName } from '../../types/interfaces';

interface ScreenHeaderProps {
  title: string;
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, currentScreen, onNavigate }) => {
  const { user, logout } = useAuth();
  // Verifica se o usuário tem e-mail (autenticado) ou se é anônimo
  const isAuthenticated = !!user?.email;

  // Não renderiza o header nas telas de autenticação
  if (!user || currentScreen === 'Splash' || currentScreen === 'Login' || currentScreen === 'Signup') {
    return null;
  }

  const navItems: { name: string, screen: ScreenName }[] = [
    { name: 'Dashboard', screen: 'Home' },
    { name: 'Artigos', screen: 'Articles' },
    { name: 'Enquetes', screen: 'Polls' },
  ];

  return (
    <header className="bg-white shadow-md rounded-xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <h1 className="text-3xl font-extrabold text-indigo-700">{title}</h1>
        
        <div className="flex items-center space-x-3">
          {/* Exibição do E-mail/ID do Usuário */}
          <span className="text-sm font-medium text-gray-600 truncate hidden md:block">
            {user?.email || `Usuário ID: ${user?.uid.substring(0, 8)}...`}
          </span>
          {/* Botão de Logout */}
          <Button type="danger" onClick={logout} className="h-10">
            Sair
          </Button>
        </div>
      </div>
      {/* Navegação Secundária */}
      <nav className="mt-4 flex flex-wrap gap-2 border-t pt-3">
        {navItems.map((item) => (
          <Button
            key={item.screen}
            // Usa 'primary' se for a tela atual, senão 'secondary'
            type={currentScreen === item.screen ? 'primary' : 'secondary'}
            onClick={() => onNavigate(item.screen)}
            className="px-3 py-1 text-sm shadow-none"
          >
            {item.name}
          </Button>
        ))}
      </nav>
    </header>
  );
};

export default ScreenHeader;