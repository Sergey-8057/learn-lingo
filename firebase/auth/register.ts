import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export const registerUser = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  return result.user;
};
