'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

import { registerSchema } from '@/validation/registerSchema';
import { RegisterFormValues } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';
import { getAuthErrorMessage } from '@/firebase/auth/errors';
// import { saveUserToDb } from '@/firebase/db/users';

import css from './Register.module.css';

export default function Register() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);

      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      router.push('/');
      router.back();
    } catch (error) {
      setError(getAuthErrorMessage(error));
    }
  };

  return (
    <>
      <h2 className={css.modalTitle}>Registration</h2>
      <p className={css.modalText}>
        Thank you for your interest in our platform! In order to register, we need some information.
        Please provide us with the following information.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
        {error && <p className={css.error}>{error}</p>}
        <div className={css.nameWrapper}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={css.input}
            placeholder="Name"
            {...register('name')}
            required
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div className={css.emailWrapper}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={css.input}
            placeholder="Email"
            {...register('email')}
            required
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div className={css.passwordWrapper}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className={css.input}
            placeholder="Password"
            {...register('password')}
            required
          />
          {errors.password && <p>{errors.password.message}</p>}
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
          Sign Up
        </button>
      </form>
    </>
  );
}
