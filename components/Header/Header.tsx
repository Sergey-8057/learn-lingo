'use client';

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import css from './Header.module.css';

const Header = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const themes = [
    {
      main: 'var(--yellow)',
      light: 'var(--light-yellow)',
      image: '/block-1.png',
    },
    {
      main: 'var(--green)',
      light: 'var(--light-green)',
      image: '/block-2.png',
    },
    {
      main: 'var(--blue)',
      light: 'var(--light-blue)',
      image: '/block-3.png',
    },
    {
      main: 'var(--red)',
      light: 'var(--light-red)',
      image: '/block-4.png',
    },
    {
      main: 'var(--pink)',
      light: 'var(--light-pink)',
      image: '/block-5.png',
    },
  ];

  const [themeIndex, setThemeIndex] = useState(0);

  const handleThemeChange = () => {
    const nextIndex = (themeIndex + 1) % themes.length;
    const nextNextIndex = (nextIndex + 1) % themes.length;

    setThemeIndex(nextIndex);

    const root = document.documentElement;

    root.style.setProperty('--accent-color', themes[nextIndex].main);
    root.style.setProperty('--accent-next-color', themes[nextNextIndex].main);
    root.style.setProperty('--accent-light-color', themes[nextIndex].light);
    root.style.setProperty('--hero-image', `url(${themes[nextIndex].image})`);
  };

  return (
    <header className={css.header}>
      {/* Logo */}
      <Link className={css.flagLogo} href="/" aria-label="Home">
        <div className={css.flag}></div>
        <p className={css.logo}>LearnLingo</p>
      </Link>

      <button className={css.clickOnMeBtn} onClick={handleThemeChange}>
        Click on me
      </button>

      {/* Navigation */}
      <nav>
        <ul className={css.navigation}>
          <li>
            <Link
              href="/"
              className={clsx(css.navLink, {
                [css.isActive]: pathname === '/',
              })}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/teachers"
              className={clsx(css.navLink, {
                [css.isActive]: pathname === '/teachers',
              })}
            >
              Teachers
            </Link>
          </li>

          {/* ✅ Favorites — only for authorized users */}
          {user && (
            <li>
              <Link
                href="/favorites"
                className={clsx(css.navLink, {
                  [css.isActive]: pathname === '/favorites',
                })}
              >
                Favorites
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Auth section */}
      {!user ? (
        /* 🔓 NOT authorized */
        <div className={css.authLink}>
          <Link href="/auth/login" className={css.LogInLink}>
            <svg className={css.iconLogIn} width="20" height="20" aria-hidden="true">
              <use href="/symbol-defs.svg#icon-log-in" />
            </svg>
            Log in
          </Link>

          <Link href="/auth/register" className={css.registrLink}>
            Registration
          </Link>
        </div>
      ) : (
        /* 🔒 Authorized */
        <div className={css.userBox}>
          <span className={css.helloText}>
            Hello, <strong>{user.name}</strong>
          </span>
          <button onClick={logout} className={css.LogInLink}>
            Log out
            <svg className={css.iconLogOut} width="20" height="20" aria-hidden="true">
              <use href="/symbol-defs.svg#icon-log-out" />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
