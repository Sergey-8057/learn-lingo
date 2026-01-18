'use client';

import { useState } from 'react';

import css from './LogIn.module.css';


export default function LogIn() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (formData: FormData) => {
    // try {
    //   const formValues = Object.fromEntries(formData) as LoginRequest;
    //   const res = await login(formValues);
    //   if (res) {
    //     setUser(res);
    //     router.push('/profile');
    //   } else {
    //     setError('Invalid email or password');
    //   }
    // } catch (error) {
    //   setError(
    //     (error as ApiError).response?.data?.error ??
    //       (error as ApiError).message ??
    //       'Oops... some error'
    //   );
    // }
  };

  return (
    <>
      <h2 className={css.modalTitle}>Log In</h2>
      <p className={css.modalText}>
        Welcome back! Please enter your credentials to access your account and continue your search
        for an teacher.
      </p>
      <form action={handleSubmit} className={css.form}>
        <div className={css.emailWrapper}>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            placeholder="Email"
            required
          />
        </div>
        <div className={css.passwordWrapper}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            className={css.input}
            placeholder="Password"
            required
          />
          <button
            type="button"
            className={css.togglePassword}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <svg className={css.eyeIcon} width="20" height="20" aria-hidden="true">
              {/* Меняем иконку в зависимости от состояния */}
              <use href={`/symbol-defs.svg#icon-${showPassword ? 'eye' : 'eye-off'}`} />
            </svg>
          </button>
        </div>
        <button type="submit" className={css.submitButton}>
          Log in
        </button>
      </form>
    </>);
}
