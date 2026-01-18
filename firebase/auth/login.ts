import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '../firebase';

export const loginUser = async (email: string, password: string): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};
