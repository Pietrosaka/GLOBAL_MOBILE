import React, { useState } from 'react';
import { ScreenName, Poll } from '../../types/interfaces';
import ScreenHeader from '../../components/layout/ScreenHeader';
import AppContainer from '../../components/layout/AppContainer';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface PollsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

// Sub-componente para exibir uma enquete
const PollCard: React.FC<{ poll: Poll, onVote: (pollId: string, optionId: string) => Promise<void>, userId: string }> = ({ poll, onVote, userId }) => {
    const hasVoted = poll.votedBy.includes(userId);
    const [loading, setLoading] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleVote = async () => {
        if (!selectedOptionId) {
            setError("Selecione uma opção antes de votar.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await onVote(poll.id, selectedOptionId);
        } catch (e: any) {
            // Se o voto falhar, provavelmente é porque o usuário já votou (tratado no serviço)
            setError(e.message || "Erro ao tentar votar. Você já pode ter votado.");
        } finally {
            setLoading(false);
        }
    };

    const totalVotes = poll.totalVotes || 1; // Evita divisão por zero

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{poll.question}</h3>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{error}</div>}

            <div className="space-y-3">
                {poll.options.map((option) => {
                    const percentage = hasVoted ? ((option.votes / totalVotes) * 100).toFixed(1) : '0';
                    const isSelected = selectedOptionId === option.id;

                    return (
                        <div key={option.id} className="w-full">
                            <label className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 
                                ${hasVoted ? 'bg-gray-50' : isSelected ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'bg-white border hover:bg-gray-50'}
                            `}>
                                {!hasVoted && (
                                    <input
                                        type="radio"
                                        name={`poll-${poll.id}`}
                                        value={option.id}
                                        checked={isSelected}
                                        onChange={() => setSelectedOptionId(option.id)}
                                        className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                                        disabled={loading}
                                    />
                                )}
                                <span className={`ml-3 text-gray-800 font-medium ${hasVoted ? 'w-1/3' : 'flex-grow'}`}>
                                    {option.text}
                                </span>
                                {hasVoted && (
                                    <div className="flex-grow ml-4">
                                        <div className="h-2 bg-indigo-200 rounded-full">
                                            <div 
                                                className="h-full bg-indigo-600 rounded-full" 
                                                style={{ width: `${percentage}%` }}
                                                title={`${percentage}%`}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                                {hasVoted && (
                                    <span className="ml-4 text-sm font-bold text-gray-700 w-12 text-right">
                                        {percentage}%
                                    </span>
                                )}
                            </label>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 border-t pt-4 flex justify-between items-center">
                {hasVoted ? (
                    <p className="text-sm font-semibold text-green-600">
                        Voto registrado! Total: {poll.totalVotes} votos.
                    </p>
                ) : (
                    <Button 
                        onClick={handleVote} 
                        loading={loading} 
                        className="w-full md:w-auto px-6"
                        disabled={!selectedOptionId}
                    >
                        Votar Agora
                    </Button>
                )}
                 <p className="text-sm text-gray-500">Total de Votos: {poll.totalVotes}</p>
            </div>
        </div>
    );
};


const PollsScreen: React.FC<PollsScreenProps> = ({ onNavigate }) => {
    const { polls, dataLoading, votePoll } = useData();
    const { user } = useAuth();
    const userId = user?.uid || '';

    if (!user?.email) {
        return (
            <AppContainer>
                <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-red-600">Acesso Negado</h2>
                    <p className="mt-2 text-gray-600">Você deve estar logado com e-mail/senha para participar das enquetes.</p>
                    <Button onClick={() => onNavigate('Login')} className="mt-4">
                        Ir para Login
                    </Button>
                </div>
            </AppContainer>
        );
    }

    return (
        <AppContainer>
            <ScreenHeader title="Enquetes" currentScreen='Polls' onNavigate={onNavigate} />

            {dataLoading ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" viewBox="0 0 24 24"></svg>
                    <p className="mt-2 text-gray-600">Carregando enquetes...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {polls.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                            <p className="text-gray-500 italic">Nenhuma enquete disponível no momento.</p>
                        </div>
                    ) : (
                        polls.map(poll => (
                            <PollCard key={poll.id} poll={poll} onVote={votePoll} userId={userId} />
                        ))
                    )}
                </div>
            )}
        </AppContainer>
    );
};

export default PollsScreen;