'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { useAuth } from '@/context/AuthContext';
import { getTeachersByIds } from '@/firebase/db/getTeachersByIds';
import { Teacher } from '@/firebase/db/teachers';

import css from '@/app/teachers/teachers.module.css';

const LIMIT = 4;

export default function FavoritesPage() {
  const { user, loading, toggleFavorite } = useAuth();
  const router = useRouter();

  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [visibleTeachers, setVisibleTeachers] = useState<Teacher[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;

      setIsLoading(true);

      const data = await getTeachersByIds(user.favorites);

      setAllTeachers(data);
      setVisibleTeachers(data.slice(0, LIMIT));

      setIsLoading(false);
    };

    loadFavorites();
  }, [user]);

  const loadMore = () => {
    setVisibleTeachers(prev => allTeachers.slice(0, prev.length + LIMIT));
  };

  const hasMore = visibleTeachers.length < allTeachers.length;

  const toggleTeacher = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  if (loading || isLoading) {
    return <p style={{ padding: 32 }}>Loading favorites...</p>;
  }

  if (allTeachers.length === 0) {
    return <p style={{ padding: 32 }}>You have no favorite teachers yet.</p>;
  }

  const THEME_COLORS = [
    'var(--yellow)',
    'var(--green)',
    'var(--blue)',
    'var(--red)',
    'var(--pink)',
  ];

  return (
    <div className={css.container}>
      <ul className={css.list}>
        {visibleTeachers.map(teacher => {
          const isExpanded = expandedIds.has(teacher.id);

          return (
            <li key={teacher.id} className={css.listItem}>
              <div className={css.imageBorder}>
                <div className={css.imageWrapper}>
                  <Image
                    src={teacher.avatar_url}
                    alt={teacher.name}
                    width={96}
                    height={96}
                    className={css.image}
                  />
                </div>
              </div>

              <div className={css.teacherInfo}>
                <div className={css.lineUp}>
                  <div className={css.lineUpInfo}>
                    <p className={css.lineUpText}>Lessons done: {teacher.lessons_done}</p>
                    <p className={css.lineUpText}>Rating: {teacher.rating}</p>
                    <p className={css.lineUpText}>
                      Price / 1 hour:{' '}
                      <span className={css.lineUpPrice}>{teacher.price_per_hour}$</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(teacher.id)}
                    className={css.heartButton}
                  >
                    <svg className={css.iconHeart} width="26" height="26">
                      <use href="/symbol-defs.svg#icon-heart-active" />
                    </svg>
                  </button>
                </div>

                <h3 className={css.teacherName}>
                  {teacher.name} {teacher.surname}
                </h3>

                <div className={css.teacherContCondit}>
                  <p>
                    <span className={css.teacherCondit}>Speaks: </span>
                    {teacher.languages.join(', ')}
                  </p>
                  <p>
                    <span className={css.teacherCondit}>Lesson Info: </span>
                    {teacher.lesson_info}
                  </p>
                </div>

                <button
                  className={clsx(css.buttonReadMore, {
                    [css.buttonActive]: isExpanded,
                  })}
                  onClick={() => toggleTeacher(teacher.id)}
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>

                <div className={clsx(css.hideTeacher, { [css.isVisible]: isExpanded })}>
                  <div className={css.hideTeacherContent}>
                    <p className={css.teacherExperience}>{teacher.experience}</p>
                    <ul className={css.listReview}>
                      {teacher.reviews.map((review, index) => (
                        <li key={index} className={css.itemReview}>
                          <div className={css.reviewerInfo}>
                            <p className={css.reviewerName}>{review.reviewer_name}</p>
                            <svg className={css.reviewIconStar} width="16" height="16">
                              <use href="/symbol-defs.svg#icon-star" />
                            </svg>
                            <p className={css.reviewerRating}>{review.reviewer_rating}.0</p>
                          </div>
                          <p className={css.reviewerComment}>{review.comment}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={css.levels}>
                  {teacher.levels.map((level, index) => (
                    <span
                      key={level}
                      className={css.levelTag}
                      style={{
                        backgroundColor: THEME_COLORS[index % THEME_COLORS.length],
                      }}
                    >
                      {level}
                    </span>
                  ))}
                </div>
                {isExpanded && (
                  <Link
                    href={{
                      pathname: '/teachers/book',
                      query: {
                        avatar: teacher.avatar_url,
                        name: `${teacher.name} ${teacher.surname}`,
                      },
                    }}
                    className={css.buttonBook}
                  >
                    Book trial lesson
                  </Link>
                )}
              </div>
            </li>
          );
        })}
        {hasMore && (
          <div className={css.loadMoreContainer}>
            <button onClick={loadMore} className={css.loadMoreButton}>
              Load more
            </button>
          </div>
        )}
      </ul>
    </div>
  );
}
