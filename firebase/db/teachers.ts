import { ref, get, query, limitToFirst, orderByKey, startAt } from 'firebase/database';
import { database } from '@/firebase/firebase';

type Review = {
  comment: string;
  reviewer_name: string;
  reviewer_rating: number;
};

export type Teacher = {
  id: string;
  avatar_url: string;
  name: string;
  surname: string;
  languages: string[];
  lessons_done: number;
  price_per_hour: number;
  rating: number;
  lesson_info: string;
  conditions: string[];
  levels: string[];
  experience: string;
  reviews: Review[];
};

type GetTeachersResult = {
  teachers: Teacher[];
  lastKey: string | null;
};

export const getTeachers = async (
  limit: number,
  lastKey?: string | null
): Promise<GetTeachersResult> => {
  try {
    let teachersQuery;

    if (lastKey) {
      teachersQuery = query(
        ref(database, 'teachers'),
        orderByKey(),
        startAt(lastKey),
        limitToFirst(limit + 1)
      );
    } else {
      teachersQuery = query(
        ref(database, 'teachers'), 
        orderByKey(), 
        limitToFirst(limit)
      );
    }

    const snapshot = await get(teachersQuery);

    if (!snapshot.exists()) {
      return { teachers: [], lastKey: null };
    }

    const data = snapshot.val();
    const keys = Object.keys(data);
    
    let teachers: Teacher[] = [];
    
    if (lastKey) {
      const filteredKeys = keys.slice(1);
      teachers = filteredKeys.map(key => ({
        id: key,
        ...data[key]
      }));
    } else {
      teachers = keys.map(key => ({
        id: key,
        ...data[key]
      }));
    }

    const newLastKey = teachers.length > 0 ? teachers[teachers.length - 1].id : null;

    return {
      teachers,
      lastKey: newLastKey,
    };
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return { teachers: [], lastKey: null };
  }
};