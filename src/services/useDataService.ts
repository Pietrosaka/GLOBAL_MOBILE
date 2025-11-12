import { useState, useEffect, useMemo } from 'react';
import { Firestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Interfaces de tipagem
export interface ResourceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DataServiceResult {
  items: ResourceItem[];
  isLoading: boolean;
  createItem: (newItem: Omit<ResourceItem, 'id'>) => Promise<{ success: boolean; message: string; data?: ResourceItem }>;
  updateItem: (updatedItem: ResourceItem) => Promise<{ success: boolean; message: string; data?: ResourceItem }>;
  deleteItem: (itemId: string) => Promise<{ success: boolean; message: string }>;
}

/**
 * Service hook to manage Firestore CRUD operations (Resources).
 * @param db - The Firebase Firestore instance.
 * @param userId - Current authenticated user ID.
 * @param appId - Current Canvas application ID.
 */
export const useDataService = (db: Firestore | null, userId: string | null, appId: string): DataServiceResult => {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const collectionPath: string | null = useMemo(() => {
    if (userId && appId) {
      return `/artifacts/${appId}/users/${userId}/resources`;
    }
    return null;
  }, [userId, appId]);

  // Real-Time Listener (Read)
  useEffect(() => {
    if (!db || !collectionPath) {
      setItems([]); 
      return; 
    }

    setIsLoading(true);
    const collectionRef = collection(db, collectionPath);
    
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const itemsList: ResourceItem[] = snapshot.docs.map(doc => ({
        id: doc.id, 
        name: doc.data().name as string,
        description: doc.data().description as string,
        quantity: doc.data().quantity as number,
        createdAt: doc.data().createdAt as string,
        updatedAt: doc.data().updatedAt as string,
      })).filter(item => item.name && typeof item.quantity === 'number'); // Filter out incomplete data
      
      itemsList.sort((a, b) => a.name.localeCompare(b.name));
      setItems(itemsList);
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Error (onSnapshot):", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db, collectionPath]);

  const createItem = async (newItem: Omit<ResourceItem, 'id'>) => {
    if (!db || !collectionPath) return { success: false, message: 'Erro: Serviço de dados indisponível.' };
    
    try {
      if (!newItem.name || typeof newItem.quantity !== 'number' || newItem.quantity < 0) {
        throw new Error("Nome e quantidade válida são obrigatórios.");
      }
      
      const dataToSave = {
        name: newItem.name,
        description: newItem.description || '',
        quantity: newItem.quantity,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, collectionPath), dataToSave);
      return { success: true, data: { id: docRef.id, ...dataToSave }, message: 'Recurso criado com sucesso!' };
    } catch (error: any) {
      console.error("Create Item Error:", error);
      return { success: false, message: error.message || 'Falha ao criar recurso no Firestore.' };
    }
  };

  const updateItem = async (updatedItem: ResourceItem) => {
    if (!db || !collectionPath) return { success: false, message: 'Erro: Serviço de dados indisponível.' };

    try {
      if (!updatedItem.id) throw new Error("ID do item é obrigatório para atualização.");
      if (!updatedItem.name || typeof updatedItem.quantity !== 'number' || updatedItem.quantity < 0) {
        throw new Error("Nome e quantidade válida são obrigatórios.");
      }
      
      const docRef = doc(db, collectionPath, updatedItem.id);
      
      await updateDoc(docRef, {
        name: updatedItem.name,
        description: updatedItem.description || '',
        quantity: updatedItem.quantity,
        updatedAt: new Date().toISOString()
      });
      return { success: true, data: updatedItem, message: 'Recurso atualizado com sucesso!' };
    } catch (error: any) {
      console.error("Update Item Error:", error);
      return { success: false, message: error.message || 'Falha ao atualizar recurso no Firestore.' };
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!db || !collectionPath) return { success: false, message: 'Erro: Serviço de dados indisponível.' };
    
    try {
      const docRef = doc(db, collectionPath, itemId);
      await deleteDoc(docRef);
      return { success: true, message: 'Recurso deletado com sucesso!' };
    } catch (error: any) {
      console.error("Delete Item Error:", error);
      return { success: false, message: error.message || 'Falha ao deletar recurso no Firestore.' };
    }
  };

  return { items, isLoading, createItem, updateItem, deleteItem };
};