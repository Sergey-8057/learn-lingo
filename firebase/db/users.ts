import { ref, set } from 'firebase/database';
import { database } from '../firebase';

type UserDb = {
  name: string;
  email: string;
  favorites: string[];
};

export const saveUserToDb = async (uid: string, data: UserDb) => {
  await set(ref(database, `users/${uid}`), data);
};
