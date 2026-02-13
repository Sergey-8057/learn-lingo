'use client';

import { useState, useEffect, useRef } from 'react';

import { languages, levelOfKnowledge, prices } from '@/constants/constants';
import css from './Filter.module.css';

type TeachersFilterParams = {
  language?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
};

interface FilterBoxProps {
  onFilterChange?: (filters: TeachersFilterParams) => void;
}

export default function Filter({ onFilterChange }: FilterBoxProps) {
  const [openLanguage, setOpenLanguage] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);
  const [openPriceFrom, setOpenPriceFrom] = useState(false);
  const [openPriceTo, setOpenPriceTo] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedPriceFrom, setSelectedPriceFrom] = useState<number | null>(null);
  const [selectedPriceTo, setSelectedPriceTo] = useState<number | null>(null);

  const languageMenuRef = useRef<HTMLUListElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const levelMenuRef = useRef<HTMLUListElement>(null);
  const levelButtonRef = useRef<HTMLButtonElement>(null);
  const priceFromMenuRef = useRef<HTMLUListElement>(null);
  const priceFromButtonRef = useRef<HTMLButtonElement>(null);
  const priceToMenuRef = useRef<HTMLUListElement>(null);
  const priceToButtonRef = useRef<HTMLButtonElement>(null);

  const sortedLanguages = [...languages].sort();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node) &&
        languageButtonRef.current &&
        !languageButtonRef.current.contains(event.target as Node)
      ) {
        setOpenLanguage(false);
      }

      if (
        levelMenuRef.current &&
        !levelMenuRef.current.contains(event.target as Node) &&
        levelButtonRef.current &&
        !levelButtonRef.current.contains(event.target as Node)
      ) {
        setOpenLevel(false);
      }

      if (
        priceFromMenuRef.current &&
        !priceFromMenuRef.current.contains(event.target as Node) &&
        priceFromButtonRef.current &&
        !priceFromButtonRef.current.contains(event.target as Node)
      ) {
        setOpenPriceFrom(false);
      }

      if (
        priceToMenuRef.current &&
        !priceToMenuRef.current.contains(event.target as Node) &&
        priceToButtonRef.current &&
        !priceToButtonRef.current.contains(event.target as Node)
      ) {
        setOpenPriceTo(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    onFilterChange?.({
      language: selectedLanguage || undefined,
      level: selectedLevel || undefined,
      minPrice: selectedPriceFrom ?? undefined,
      maxPrice: selectedPriceTo ?? undefined,
    });
  }, [selectedLanguage, selectedLevel, selectedPriceFrom, selectedPriceTo, onFilterChange]);


  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const filters: TeachersFilterParams = {
  //     language: selectedLanguage || undefined,
  //     level: selectedLevel || undefined,
  //     minPrice: selectedPriceFrom || undefined,
  //     maxPrice: selectedPriceTo || undefined,
  //   };

  //   onFilterChange(filters);
  // };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setTimeout(() => {
      setOpenLanguage(false);
    }, 10);
  };

  const handleLanguageClear = () => {
    setSelectedLanguage('');
    setTimeout(() => {
      setOpenLanguage(false);
    }, 10);
  };

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    setTimeout(() => {
      setOpenLevel(false);
    }, 10);
  };

  const handleLevelClear = () => {
    setSelectedLevel('');
    setTimeout(() => {
      setOpenLevel(false);
    }, 10);
  };

  const handlePriceFromSelect = (price: number) => {
    setSelectedPriceFrom(price);
    setTimeout(() => {
      setOpenPriceFrom(false);
    }, 10);
  };

  const handlePriceFromClear = () => {
    setSelectedPriceFrom(null);
    setTimeout(() => {
      setOpenPriceFrom(false);
    }, 10);
  };

  const handlePriceToSelect = (price: number) => {
    setSelectedPriceTo(price);
    setTimeout(() => {
      setOpenPriceTo(false);
    }, 10);
  };

  const handlePriceToClear = () => {
    setSelectedPriceTo(null);
    setTimeout(() => {
      setOpenPriceTo(false);
    }, 10);
  };

  const handleToggleLanguageMenu = () => {
    setOpenLanguage(prev => !prev);
    setOpenLevel(false);
    setOpenPriceFrom(false);
    setOpenPriceTo(false);
  };

  const handleToggleLevelMenu = () => {
    setOpenLevel(prev => !prev);
    setOpenLanguage(false);
    setOpenPriceFrom(false);
    setOpenPriceTo(false);
  };

  const handleTogglePriceFromMenu = () => {
    setOpenPriceFrom(prev => !prev);
    setOpenLevel(false);
    setOpenLanguage(false);
    setOpenPriceTo(false);
  };

  const handleTogglePriceToMenu = () => {
    setOpenPriceTo(prev => !prev);
    setOpenLevel(false);
    setOpenLanguage(false);
    setOpenPriceFrom(false);
  };

  return (
    <section className={css.container}>
      <form className={css.form}>
        <div className={css.formGroup}>
          <label className={css.label}>
            Languages
            <button
              ref={languageButtonRef}
              type="button"
              className={css.menuButton}
              onClick={handleToggleLanguageMenu}
            >
              {selectedLanguage || 'Choose a language'}
              {openLanguage ? (
                <svg width="14" height="14" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-up" />
                </svg>
              ) : (
                <svg width="14" height="14" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-down" />
                </svg>
              )}
            </button>
            {openLanguage && (
              <ul ref={languageMenuRef} className={css.menuList}>
                <li
                  className={css.menuItem}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLanguageClear();
                  }}
                >
                  All languages
                </li>
                {sortedLanguages.map((language, i) => (
                  <li
                    key={i}
                    className={css.menuItem}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLanguageSelect(language);
                    }}
                  >
                    {language}
                  </li>
                ))}
              </ul>
            )}
          </label>

          <label className={css.label}>
            Level of knowledge
            <button
              ref={levelButtonRef}
              type="button"
              className={css.menuButton}
              onClick={handleToggleLevelMenu}
            >
              {selectedLevel || 'Choose a level'}
              {openLevel ? (
                <svg width="14" height="14" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-up" />
                </svg>
              ) : (
                <svg width="14" height="14" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-down" />
                </svg>
              )}
            </button>
            {openLevel && (
              <ul ref={levelMenuRef} className={css.menuList}>
                <li
                  className={css.menuItem}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLevelClear();
                  }}
                >
                  All levels
                </li>
                {levelOfKnowledge.map((level, i) => (
                  <li
                    key={i}
                    className={css.menuItem}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLevelSelect(level);
                    }}
                  >
                    {level}
                  </li>
                ))}
              </ul>
            )}
          </label>

          <label className={css.label}>
            Min price
            <button
              ref={priceFromButtonRef}
              type="button"
              className={css.menuButton}
              onClick={handleTogglePriceFromMenu}
            >
              {selectedPriceFrom ? `${selectedPriceFrom}` : 'Choose a min price'}
              {openPriceFrom ? (
                <svg width="14" height="14" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-up" />
                </svg>
              ) : (
                <svg width="14" height="14" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-down" />
                </svg>
              )}
            </button>
            {openPriceFrom && (
              <ul ref={priceFromMenuRef} className={css.menuList}>
                <li
                  className={css.menuItem}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePriceFromClear();
                  }}
                >
                  All prices
                </li>
                {prices.map(price => (
                  <li
                    key={price}
                    className={css.menuItem}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePriceFromSelect(price);
                    }}
                  >
                    {price}
                  </li>
                ))}
              </ul>
            )}
          </label>

          <label className={css.label}>
            Max price
            <button
              ref={priceToButtonRef}
              type="button"
              className={css.menuButton}
              onClick={handleTogglePriceToMenu}
            >
              {selectedPriceTo ? `${selectedPriceTo}` : 'Choose a max price'}
              {openPriceTo ? (
                <svg width="14" height="14" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-up" />
                </svg>
              ) : (
                <svg width="14" height="14" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-down" />
                </svg>
              )}
            </button>
            {openPriceTo && (
              <ul ref={priceToMenuRef} className={css.menuList}>
                <li
                  className={css.menuItem}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePriceToClear();
                  }}
                >
                  All prices
                </li>
                {prices.map(price => (
                  <li
                    key={price}
                    className={css.menuItem}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePriceToSelect(price);
                    }}
                  >
                    {price}
                  </li>
                ))}
              </ul>
            )}
          </label>

        </div>
      </form>
    </section>
  );
}
