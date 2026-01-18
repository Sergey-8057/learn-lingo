'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';

import css from './Modal.module.css';

type Props = {
  children: React.ReactNode;
};

export default function Modal({ children }: Props) {
  const router = useRouter();

  const close = useCallback(() => {
    router.back();
  }, [router]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      close();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [close]);

  return (
    <div className={css.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={css.modal}>
        <button className={css.closeButton} onClick={close} aria-label="Close modal">
          <svg className={css.iconClose} width="32" height="32" aria-hidden="true">
            <use href="/symbol-defs.svg#icon-close" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
