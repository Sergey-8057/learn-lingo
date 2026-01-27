'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { loginSchema } from '@/validation/loginSchema';
import { LoginFormValues } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';
import { getAuthErrorMessage } from '@/firebase/auth/errors';

import css from './LogIn.module.css';

export default function LogIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      setIsLoading(true);

      await login(data.email, data.password);

      reset();
      router.back();
      router.refresh();
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className={css.modalTitle}>Log In</h2>
      <p className={css.modalText}>
        Welcome back! Please enter your credentials to access your account and continue your search
        for an teacher.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
        {error && <p className={css.error}>{error}</p>}
        <div className={css.emailWrapper}>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className={css.input}
            autoComplete="email"
            {...register('email')}
            required
          />
          {errors.email && <p className={css.errorText}>{errors.email.message}</p>}
        </div>
        <div className={css.passwordWrapper}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className={css.input}
            placeholder="Password"
            autoComplete="current-password"
            {...register('password')}
            required
          />
          <button
            type="button"
            className={css.togglePassword}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <svg className={css.eyeIcon} width="20" height="20" aria-hidden="true">
              <use href={`/symbol-defs.svg#icon-${showPassword ? 'eye' : 'eye-off'}`} />
            </svg>
          </button>
        </div>
        <button className={css.submitButton} type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </>
  );
}
