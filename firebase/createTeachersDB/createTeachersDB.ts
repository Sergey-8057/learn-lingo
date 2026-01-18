import { push, ref, set } from 'firebase/database';
import { database } from '../firebase';

import teachers from './teachers.json';

export const createTeachersDB = () => {
  teachers.forEach(async teacher => {
    const newRef = push(ref(database, 'teachers'));
    await set(newRef, teacher);
  });
};
