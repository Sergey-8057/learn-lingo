'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { bookSchema } from '@/validation/bookSchema';
import toast from 'react-hot-toast';
import css from './Book.module.css';

type FormData = {
  reason: string;
  name: string;
  email: string;
  phone: string;
};

export default function Book() {
  const searchParams = useSearchParams();
  const [teacherAvatar, setTeacherAvatar] = useState<string>('');
  const [teacherName, setTeacherName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const avatar = searchParams.get('avatar');
    const name = searchParams.get('name');

    if (avatar) setTeacherAvatar(avatar);
    if (name) setTeacherName(name);
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(bookSchema),
    mode: 'onTouched',
    defaultValues: {
      reason: '',
      name: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log('Form data:', data);

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Your request has been successfully sent!', {
        duration: 4000,
        position: 'top-center',
      });

      reset();

      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className={css.modalTitle}>Book trial lesson</h2>
      <p className={css.modalText}>
        Our experienced tutor will assess your current language level, discuss your learning goals,
        and tailor the lesson to your specific needs.
      </p>

      {teacherAvatar && teacherName && (
        <div className={css.teacherInfo}>
          <div className={css.teacherPhoto}>
            <Image
              src={teacherAvatar}
              alt={teacherName}
              width={44}
              height={44}
              className={css.teacherImage}
            />
          </div>
          <div>
            <p className={css.teacherText}>Your teacher</p>
            <p className={css.teacherName}>{teacherName}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={css.form} noValidate>
        <h3 className={css.reasonTitle}>What is your main reason for learning English?</h3>
        {errors.reason && <span className={css.errorText}>{errors.reason.message}</span>}
        <div className={css.radioWrapper}>
          {['business', 'kids', 'abroad', 'coursework', 'hobby'].map(value => (
            <label key={value} className={css.radioInput}>
              <input type="radio" value={value} {...register('reason')} />
              <span className={css.radioText}>
                {value === 'business' && 'Career and business'}
                {value === 'kids' && 'Lesson for kids'}
                {value === 'abroad' && 'Living abroad'}
                {value === 'coursework' && 'Exams and coursework'}
                {value === 'hobby' && 'Culture, travel or hobby'}
              </span>
            </label>
          ))}
        </div>


        <div className={css.nameWrapper}>
          <input
            id="name"
            type="text"
            className={`${css.input} ${errors.name ? css.inputError : ''}`}
            placeholder="Full Name"
            {...register('name')}
          />
          {errors.name && <span className={css.errorText}>{errors.name.message}</span>}
        </div>

        <div className={css.emailWrapper}>
          <input
            id="email"
            type="email"
            className={`${css.input} ${errors.email ? css.inputError : ''}`}
            placeholder="Email"
            {...register('email')}
          />
          {errors.email && <span className={css.errorText}>{errors.email.message}</span>}
        </div>

        <div className={css.passwordWrapper}>
          <input
            id="phone"
            type="tel"
            className={`${css.input} ${errors.phone ? css.inputError : ''}`}
            placeholder="Phone number"
            {...register('phone')}
          />
          {errors.phone && <span className={css.errorText}>{errors.phone.message}</span>}
        </div>

        <button className={css.submitButton} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Booking...' : 'Book'}
        </button>
      </form>
    </>
  );
}
