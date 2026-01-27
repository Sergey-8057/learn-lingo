'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { registerSchema } from '@/validation/registerSchema';
import { RegisterFormValues } from '@/types/auth';
import { registerUser } from '@/firebase/auth/register';
import { getAuthErrorMessage } from '@/firebase/auth/errors';
import { saveUserToDb } from '@/firebase/db/users';

import css from './Register.module.css';

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);
      setIsLoading(true);

      const user = await registerUser(data.email, data.password);

      await saveUserToDb(user.uid, {
        name: data.name,
        email: data.email,
        favorites: [],
      });

      toast.success('Registration successful! Welcome!', {
        duration: 3000,
        position: 'top-center',
      });

      reset();
      router.back();
      router.refresh();
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error);
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
            className={css.input}
            placeholder="Name"
            autoComplete="name"
            {...register('name')}
            required
          />
          {errors.name && <p className={css.errorText}>{errors.name.message}</p>}
        </div>
        <div className={css.emailWrapper}>
          <input
            id="email"
            type="email"
            className={css.input}
            placeholder="Email"
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
            autoComplete="new-password"
            {...register('password')}
            required
          />
          {errors.password && <p className={css.errorText}>{errors.password.message}</p>}
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
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </>
  );
}
