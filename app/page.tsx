'use client';

import Link from 'next/link';

import css from './page.module.css';

export default function Home() {

  return (
    <>
      <section className={css.hero}>
        <div className={css.heroTitleText}>
          <h1 className={css.heroTitle}>
            Unlock your potential with the best <span className={css.heroLanguage}>language</span>
            tutors
          </h1>
          <p className={css.heroText}>
            Embark on an Exciting Language Journey with Expert Language Tutors: Elevate your
            language proficiency to new heights by connecting with highly qualified and experienced
            tutors.
          </p>
          <Link className={css.heroLink} href="/teachers">
            Get started
          </Link>
        </div>
        <div className={css.Image}></div>
      </section>
      <section className={css.info}>
        <ul className={css.infoList}>
          <li className={css.infoItem}>
            <p className={css.infoNumber}>32,000 +</p>
            <p className={css.infoText}>Experienced tutors</p>
          </li>
          <li className={css.infoItem}>
            <p className={css.infoNumber}>300,000 +</p>
            <p className={css.infoText}>5-star tutor reviews</p>
          </li>
          <li className={css.infoItem}>
            <p className={css.infoNumber}>120 +</p>
            <p className={css.infoText}>Subjects taught</p>
          </li>
          <li className={css.infoItem}>
            <p className={css.infoNumber}>200 +</p>
            <p className={css.infoText}>Tutor nationalities</p>
          </li>
        </ul>
      </section>
    </>
  );
}
