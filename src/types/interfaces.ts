import { Timestamp } from 'firebase/firestore';

// --- Tipos de Auth ---
export interface User {
  uid: string;
  email: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isReady: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// --- Tipos de Dados da Aplicação (O Futuro do Trabalho) ---

export type ArticleCategory = 'IA' | 'Remoto' | 'SoftSkills' | 'Geral';

export interface Article {
  id: string;
  title: string;
  summary: string;
  category: ArticleCategory;
  url: string;
  // userId que salvou o artigo (para fins de CRUD e demonstração)
  savedByUserId: string;
  createdAt: Timestamp;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  // Array de UIDs de usuários que já votaram (simplificação)
  votedBy: string[]; 
  createdAt: Timestamp;
}

// --- Tipos de Serviço de Dados ---
export interface DataContextType {
  articles: Article[];
  polls: Poll[];
  dataLoading: boolean;
  dataError: string | null;
  // Ações de CRUD
  saveArticle: (title: string, summary: string, category: ArticleCategory, url: string) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  votePoll: (pollId: string, optionId: string, userId: string) => Promise<void>;
}

// --- Tipos de Navegação (Simulando um router) ---
export type ScreenName = 'Splash' | 'Login' | 'Signup' | 'Home' | 'Articles' | 'Polls';

export interface AppState {
    currentScreen: ScreenName;
    user: User | null;
    isAuthReady: boolean;
}