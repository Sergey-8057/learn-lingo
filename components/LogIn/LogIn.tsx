'use client';

import { useState} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

import { loginSchema } from '@/validation/loginSchema';
import { LoginFormValues } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';
import { getAuthErrorMessage } from '@/firebase/auth/errors';

import css from './LogIn.module.css';

export default function LogIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      await login(data.email, data.password);
      router.push('/');
    } catch (err) {
      setError(getAuthErrorMessage(err));
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
            autoComplete="email"
            className={css.input}
            {...register('email')}
            required
          />
          {errors.email && <p className={css.error}>{errors.email.message}</p>}
        </div>
        <div className={css.passwordWrapper}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className={css.input}
            placeholder="Password"
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
        <button className={css.submitButton} type="submit" disabled={isSubmitting}>
          Log in
        </button>
      </form>
    </>
  );
}
