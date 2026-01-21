import { ref, get } from 'firebase/database';
import { database } from '@/firebase/firebase';
import { Teacher } from './teachers';

export const getTeachersByIds = async (ids: string[]): Promise<Teacher[]> => {
  if (ids.length === 0) return [];

  const snapshot = await get(ref(database, 'teachers'));

  if (!snapshot.exists()) return [];

  const data = snapshot.val();

  return Object.entries(data)
    .filter(([id]) => ids.includes(id))
    .map(([id, teacher]) => ({
      id,
      ...(teacher as Omit<Teacher, 'id'>),
    }));
};
