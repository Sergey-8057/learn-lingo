'use client';

import { useEffect, useState } from 'react';
import { getTeachers, Teacher } from '@/firebase/db/teachers';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const data = await getTeachers();
        setTeachers(data);
      } catch (error) {
        setError('Failed to load teachers');
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

  if (loading) return <p>Loading teachers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {teachers.map((teacher, index) => (
        <li key={index}>
          {/* < key={teacher.id}> */}
          <h3>{teacher.name}</h3>
          <p>{teacher.language}</p>
          <p>${teacher.price}</p>
          <p>⭐ {teacher.rating}</p>
        </li>
      ))}
    </ul>
  );
}
