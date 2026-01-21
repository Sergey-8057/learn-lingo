import { ref, get, set } from 'firebase/database';
import { database } from '@/firebase/firebase';

export const toggleFavoriteTeacher = async (uid: string, teacherId: string): Promise<string[]> => {
  const userRef = ref(database, `users/${uid}/favorites`);
  const snapshot = await get(userRef);

  let favorites: string[] = snapshot.exists() ? snapshot.val() : [];

  if (favorites.includes(teacherId)) {
    favorites = favorites.filter(id => id !== teacherId);
  } else {
    favorites.push(teacherId);
  }

  await set(userRef, favorites);
  return favorites;
};
