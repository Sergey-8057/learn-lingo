'use client';

import { useEffect, useState } from 'react';
import { getAllTeachers, Teacher } from '@/firebase/db/teachers';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import toast from 'react-hot-toast';

import { useAuth } from '@/context/AuthContext';
import Filter from '@/components/Filter/Filter'
import css from './teachers.module.css';

type TeachersFilterParams = {
  language?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
};

export default function TeachersPage() {
  const LIMIT = 4;
  
  const [filters, setFilters] = useState<TeachersFilterParams>({});
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(LIMIT);
  const [error, setError] = useState<string | null>(null);
  const { user, toggleFavorite } = useAuth();

  const hasActiveFilters = Object.values(filters).some(Boolean);
  
  const filteredTeachers = teachers.filter(teacher => {
    if (filters.language && !teacher.languages.includes(filters.language)) {
      return false;
    }

    if (filters.level && !teacher.levels.includes(filters.level)) {
      return false;
    }

    if (filters.minPrice !== undefined && teacher.price_per_hour < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice !== undefined && teacher.price_per_hour > filters.maxPrice) {
      return false;
    }

    return true;
  });

  const visibleTeachers = filteredTeachers.slice(0, visibleCount);

  useEffect(() => {
  const loadTeachers = async () => {
    setIsInitialLoading(true);

    try {
      const teachers = await getAllTeachers();
      setTeachers(teachers);
    } catch (err) {
      setError('Failed to load teachers');
      console.error(err);
    } finally {
      setIsInitialLoading(false);
    }
  };

  loadTeachers();
}, []);

  const loadMoreTeachers = () => {
    setVisibleCount(prev => prev + LIMIT);
  };

  const hasMore = visibleTeachers.length < filteredTeachers.length;

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
        <button onClick={() => window.location.reload()} className={css.retryButton}>
          Try again
        </button>
      </div>
    );
  }

  const handleFavoriteClick = async (teacherId: string) => {
    if (!user) {
      toast.error('This feature is available only for authorized users');
      return;
    }

    try {
      await toggleFavorite(teacherId);
    } catch (err) {
      toast.error('Failed to update favorites');
      console.error(err);
    }
  };
  

  return (
    <>
      <Filter onFilterChange={setFilters} />
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
                        <p className={clsx(css.lineUpText, css.vertLine)}>
                          Rating: {teacher.rating}
                        </p>
                      </div>
                      <p className={css.lineUpText}>
                        Price / 1 hour:{' '}
                        <span className={css.lineUpPrice}>{teacher.price_per_hour}$</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFavoriteClick(teacher.id)}
                      className={css.heartButton}
                    >
                      <svg className={css.iconHeart} width="26" height="26" aria-hidden="true">
                        <use
                          href={
                            user?.favorites.includes(teacher.id)
                              ? '/symbol-defs.svg#icon-heart-active'
                              : '/symbol-defs.svg#icon-heart'
                          }
                        />
                      </svg>
                    </button>
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

          {hasActiveFilters && filteredTeachers.length === 0 && (
            <p className={css.noMoreTeachers}>No teachers found</p>
          )}

          {error && teachers.length > 0 && (
            <div className={css.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          {hasMore && (
            <div className={css.loadMoreContainer}>
              <button onClick={loadMoreTeachers} className={css.loadMoreButton}>
                Load more
              </button>
            </div>
          )}

          {!hasMore && filteredTeachers.length > 0 && (
            <p className={css.noMoreTeachers}>All teachers loaded</p>
          )}
        </ul>
      </div>
    </>
  );
}
