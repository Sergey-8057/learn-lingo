import { FirebaseError } from 'firebase/app';

export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/user-not-found':
        return 'User not found';
      case 'auth/wrong-password':
        return 'Wrong password';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      default:
        return 'Authentication error';
    }
  }

  return 'Something went wrong';
};
