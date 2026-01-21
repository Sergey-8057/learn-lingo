'use client';

import { useEffect, useState } from 'react';
import { getTeachers, Teacher } from '@/firebase/db/teachers';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import css from './teachers.module.css';

export default function TeachersPage() {
  const LIMIT = 4;
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialTeachers = async () => {
      setIsInitialLoading(true);
      setError(null);
      try {
        const { teachers, lastKey } = await getTeachers(LIMIT);
        setTeachers(teachers);
        setLastKey(lastKey);
        setHasMore(teachers.length === LIMIT);
      } catch (err) {
        setError('Failed to load teachers');
        console.error(err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialTeachers();
  }, []);

  const loadMoreTeachers = async () => {
    if (!lastKey || isLoadingMore) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const { teachers: newTeachers, lastKey: newLastKey } = await getTeachers(LIMIT, lastKey);

      setTeachers(prev => [...prev, ...newTeachers]);
      setLastKey(newLastKey);
      setHasMore(newTeachers.length === LIMIT);
    } catch (err) {
      setError('Failed to load more teachers');
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const THEME_COLORS = [
    'var(--yellow)',
    'var(--green)',
    'var(--blue)',
    'var(--red)',
    'var(--pink)',
  ];

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

  if (isInitialLoading) {
    return (
      <div className={css.loadingContainer}>
        <p>Loading teachers...</p>
      </div>
    );
  }

  if (error && teachers.length === 0) {
    return (
      <div className={css.errorContainer}>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={css.retryButton}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <ul className={css.list}>
        {teachers.map(teacher => {
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
                    <div className={css.lineUpIconText}>
                      <svg className={css.iconBookOpen} width="20" height="20" aria-hidden="true">
                        <use href="/symbol-defs.svg#icon-book-open" />
                      </svg>
                      <p className={clsx(css.lineUpText, css.vertLine)}>Lessons online</p>
                    </div>
                    <p className={clsx(css.lineUpText, css.vertLineCentr)}>
                      Lessons done: {teacher.lessons_done}
                    </p>
                    <div className={css.lineUpIconText}>
                      <svg className={css.iconStar} width="16" height="16">
                        <use href="/symbol-defs.svg#icon-star" />
                      </svg>
                      <p className={clsx(css.lineUpText, css.vertLine)}>Rating: {teacher.rating}</p>
                    </div>
                    <p className={css.lineUpText}>
                      Price / 1 hour:{' '}
                      <span className={css.lineUpPrice}>{teacher.price_per_hour}$</span>
                    </p>
                  </div>
                  <svg className={css.iconHeart} width="26" height="26" aria-hidden="true">
                    <use href="/symbol-defs.svg#icon-heart" />
                  </svg>
                </div>

                <h3 className={css.teacherName}>
                  {teacher.name} {teacher.surname}
                </h3>

                <div className={css.teacherContCondit}>
                  <p>
                    <span className={css.teacherCondit}>Speaks: </span>
                    <span className={css.teacherLanguages}>{teacher.languages.join(', ')}</span>
                  </p>
                  <p>
                    <span className={css.teacherCondit}>Lesson Info: </span>
                    {teacher.lesson_info}
                  </p>
                  <p>
                    <span className={css.teacherCondit}>Conditions: </span>
                    {teacher.conditions.join(' ')}
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
                  <Link href="/teachers" className={css.buttonBook}>
                    Book trial lesson
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {error && teachers.length > 0 && (
        <div className={css.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {hasMore && (
        <div className={css.loadMoreContainer}>
          <button
            onClick={loadMoreTeachers}
            disabled={isLoadingMore}
            className={css.loadMoreButton}
          >
            {isLoadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}

      {!hasMore && teachers.length > 0 && (
        <p className={css.noMoreTeachers}>All teachers loaded</p>
      )}
    </div>
  );
}