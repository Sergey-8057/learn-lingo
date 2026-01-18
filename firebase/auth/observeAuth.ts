import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';

export const observeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

