import React, { useState, useCallback } from 'react';
import { ScreenName, Article, ArticleCategory } from '../../types/interfaces';
import ScreenHeader from '../../components/layout/ScreenHeader';
import AppContainer from '../../components/layout/AppContainer';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

interface ArticleListScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

// Sub-componente para o formulário de adição/edição
const AddArticleForm: React.FC<{ onSave: (data: Omit<Article, 'id' | 'savedByUserId' | 'createdAt'>) => Promise<void>, onCancel: () => void }> = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState<ArticleCategory>('Geral');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await onSave({ title, summary, category, url });
            // Limpar formulário após sucesso
            setTitle('');
            setSummary('');
            setUrl('');
            setCategory('Geral');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Salvar Novo Artigo (Link)</h3>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="title" label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <Input id="url" label="Link (URL)" type="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="category">Categoria</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ArticleCategory)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="Geral">Geral</option>
                        <option value="IA">IA & Automação</option>
                        <option value="Remoto">Trabalho Remoto</option>
                        <option value="SoftSkills">Soft Skills</option>
                    </select>
                </div>
                <Input id="summary" label="Resumo (Opcional)" value={summary} onChange={(e) => setSummary(e.target.value)} />
                <div className="flex space-x-3">
                    <Button type="submit" loading={loading} className="flex-1">Salvar Artigo</Button>
                </div>
            </form>
        </div>
    );
};

// Sub-componente para o cartão de artigo
const ArticleCard: React.FC<{ article: Article, userId: string, onDelete: (id: string) => Promise<void> }> = ({ article, userId, onDelete }) => {
    const isOwner = article.savedByUserId === userId;

    const handleDelete = async () => {
        // Usa um modal de confirmação no console para simular um confirm real
        if (window.confirm('Tem certeza de que deseja excluir este artigo?')) {
            try {
                await onDelete(article.id);
            } catch (e) {
                console.error("Erro ao excluir:", e);
                // Em um app real, mostraríamos uma notificação de erro.
            }
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-indigo-700 hover:text-indigo-900 transition-colors">
                    {article.title}
                </a>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${article.category === 'IA' ? 'bg-teal-100 text-teal-800' : article.category === 'Remoto' ? 'bg-purple-100 text-purple-800' : article.category === 'SoftSkills' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {article.category}
                </span>
            </div>
            <p className="mt-2 text-gray-600 text-sm">{article.summary || "Nenhum resumo fornecido."}</p>
            <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
                <span className='truncate'>Salvo por: {article.savedByUserId.substring(0, 8)}...</span>
                {isOwner && (
                    <Button variant="danger" onClick={handleDelete} className="p-1 text-xs h-7">
                        Excluir
                    </Button>
                )}
            </div>
        </div>
    );
};


const ArticleListScreen: React.FC<ArticleListScreenProps> = ({ onNavigate }) => {
    const { articles, dataLoading, saveArticle, deleteArticle, dataError } = useData();
    const { user } = useAuth();
    const userId = user?.uid || '';
    const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'Todos'>('Todos');

    const handleSave = useCallback(async (data: Omit<Article, 'id' | 'savedByUserId' | 'createdAt'>) => {
        await saveArticle(data.title, data.summary, data.category, data.url);
    }, [saveArticle]);

    const filteredArticles = articles.filter(article => 
        selectedCategory === 'Todos' || article.category === selectedCategory
    );

    return (
        <AppContainer>
            <ScreenHeader title="Artigos Salvos" currentScreen='Articles' onNavigate={onNavigate} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulário (Coluna 1) */}
                <div className="lg:col-span-1">
                    <AddArticleForm onSave={handleSave} onCancel={() => {}} />
                </div>
                
                {/* Lista e Filtros (Colunas 2/3) */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Filtro por Categoria</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Todos', 'IA', 'Remoto', 'SoftSkills', 'Geral'].map(cat => (
                                <Button
                                    key={cat}
                                    variant={selectedCategory === cat ? 'primary' : 'secondary'}
                                    onClick={() => setSelectedCategory(cat as ArticleCategory | 'Todos')}
                                    className="text-sm px-3 py-1"
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {dataLoading ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                            <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" viewBox="0 0 24 24"></svg>
                            <p className="mt-2 text-gray-600">Carregando artigos...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {dataError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">{dataError}</div>}
                            {filteredArticles.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                                    <p className="text-gray-500 italic">Nenhum artigo encontrado nesta categoria.</p>
                                </div>
                            ) : (
                                filteredArticles.map(article => (
                                    <ArticleCard 
                                        key={article.id} 
                                        article={article} 
                                        userId={userId} 
                                        onDelete={deleteArticle}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppContainer>
    );
};

export default ArticleListScreen;