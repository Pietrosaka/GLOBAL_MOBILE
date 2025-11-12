import React from 'react';
import { ScreenName } from '../../types/interfaces';
import ScreenHeader from '../../components/layout/ScreenHeader';
import AppContainer from '../../components/layout/AppContainer';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/ui/Button';

interface HomeScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="text-indigo-500">{icon}</div>
        </div>
        <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { articles, polls, dataLoading } = useData();
  const { user } = useAuth();
  
  const totalArticles = articles.length;
  const articlesSavedByUser = articles.filter(a => a.savedByUserId === user?.uid).length;
  const totalPolls = polls.length;
  const userVoted = polls.some(p => p.votedBy.includes(user?.uid || ''));

  return (
    <AppContainer>
      <ScreenHeader title="Dashboard do Futuro" currentScreen='Home' onNavigate={onNavigate} />

      <div className="space-y-8">
        {/* Seção de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                title="Artigos no Hub" 
                value={dataLoading ? '...' : totalArticles.toString()} 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m-3-4L14 10l-4 4-4-4"/></svg>}
            />
            <StatCard 
                title="Meus Artigos Salvos" 
                value={dataLoading ? '...' : articlesSavedByUser.toString()} 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>}
            />
            <StatCard 
                title="Voto Registrado" 
                value={dataLoading ? '...' : userVoted ? 'Sim' : 'Não'} 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.618a8 8 0 11-11.236 0 8 8 0 0111.236 0z"/></svg>}
            />
        </div>

        {/* Seção de Tendências */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tendências Atuais</h2>
            <p className="text-gray-600 mb-4">Explore as áreas mais discutidas que moldarão o amanhã. Clique para ver os artigos!</p>
            <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => onNavigate('Articles')} className="py-3 bg-teal-500 hover:bg-teal-600">
                    <span className="font-bold">IA & Automação</span>
                </Button>
                <Button onClick={() => onNavigate('Articles')} className="py-3 bg-purple-500 hover:bg-purple-600">
                    <span className="font-bold">Trabalho Remoto</span>
                </Button>
                <Button onClick={() => onNavigate('Articles')} className="py-3 bg-yellow-500 hover:bg-yellow-600">
                    <span className="font-bold">Soft Skills</span>
                </Button>
                <Button onClick={() => onNavigate('Polls')} className="py-3 bg-pink-500 hover:bg-pink-600">
                    <span className="font-bold">Participar de Enquete</span>
                </Button>
            </div>
        </div>

        {/* Seção de Ação Rápida */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ação Rápida</h2>
            <Button 
                onClick={() => onNavigate('Articles')} 
                className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-lg"
            >
                Ver Artigos Recentes
            </Button>
        </div>
      </div>
    </AppContainer>
  );
};

export default HomeScreen;