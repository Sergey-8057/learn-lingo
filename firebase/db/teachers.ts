import { ref, get } from 'firebase/database';
import { database } from '@/firebase/firebase';

export type Teacher = {
  name: string;
  language: string;
  price: number;
  rating: number;
};

export const getTeachers = async (): Promise<Teacher[]> => {
  const snapshot = await get(ref(database, 'teachers'));

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data).map(([id, teacher]) => ({
    id,
    ...(teacher as Omit<Teacher, 'id'>),
  }));
};
