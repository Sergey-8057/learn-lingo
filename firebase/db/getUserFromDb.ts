import { ref, get } from 'firebase/database';
import { database } from '../firebase';

export const getUserFromDb = async (uid: string) => {
  const snapshot = await get(ref(database, `users/${uid}`));
  return snapshot.exists() ? snapshot.val() : null;
};
