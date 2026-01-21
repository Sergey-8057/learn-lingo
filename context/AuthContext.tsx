'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/firebase/firebase';
import { getUserFromDb } from '@/firebase/db/getUserFromDb';
import { loginUser } from '@/firebase/auth/login';
import { registerUser } from '@/firebase/auth/register';
import { logoutUser } from '@/firebase/auth/logout';
import { saveUserToDb } from '@/firebase/db/users';
import { toggleFavoriteTeacher } from '@/firebase/db/favorites';


import { UserProfile } from '@/types/user';

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (teacherId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const dbUser = await getUserFromDb(firebaseUser.uid);

      if (dbUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          name: dbUser.name,
          favorites: dbUser.favorites ?? [],
        });
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await loginUser(email, password);
  };

  const register = async ({ name, email, password }: RegisterData) => {
    const firebaseUser = await registerUser(email, password);

    await saveUserToDb(firebaseUser.uid, {
      name,
      email,
      favorites: [],
    });
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const toggleFavorite = async (teacherId: string) => {
    if (!user) return;

    const updatedFavorites = await toggleFavoriteTeacher(user.uid, teacherId);

    setUser(prev =>
      prev
        ? {
            ...prev,
            favorites: updatedFavorites,
          }
        : prev
    );
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
