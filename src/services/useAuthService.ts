import { useState, useEffect } from 'react';
import { Auth, User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Interfaces de tipagem
export interface AuthUser {
  uid: string;
  email: string | null;
  name: string;
}

export interface AuthServiceResult {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message: string }>;
  signup: (credentials: { name: string; email: string; password: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

/**
 * Service hook to manage Firebase Authentication logic.
 * @param auth - The Firebase Auth instance.
 */
export const useAuthService = (auth: Auth | null): AuthServiceResult => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        setUser({ 
          uid: firebaseUser.uid,
          email: firebaseUser.email, 
          name: firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Usuário Anônimo'
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      await signInWithEmailAndPassword(auth!, email, password); // '!' afirma que auth não é nulo aqui
      return { success: true, message: 'Login realizado com sucesso!' };
    } catch (error: any) {
      let message = 'Falha no login. Verifique e-mail e senha.';
      if (error.code === 'auth/invalid-credential') {
        message = 'Credenciais inválidas ou conta não encontrada.';
      }
      return { success: false, message };
    }
  };

  const signup = async ({ email, password }: { name: string; email: string; password: string }) => {
    try {
      await createUserWithEmailAndPassword(auth!, email, password);
      return { success: true, message: 'Cadastro efetuado com sucesso! Você está logado.' };
    } catch (error: any) {
      let message = 'Falha no cadastro.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'O e-mail já está em uso.';
      } else if (error.code === 'auth/weak-password') {
        message = 'A senha deve ter pelo menos 6 caracteres.';
      }
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth!);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return { user, isAuthenticated: !!user, login, signup, logout, isLoading };
};