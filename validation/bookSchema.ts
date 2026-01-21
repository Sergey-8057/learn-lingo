import * as yup from 'yup';

export const bookSchema = yup.object({
  reason: yup.string().required('Please select a reason'),
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Full name is required')
    .matches(/^[a-zA-Zа-яА-Я\s]+$/, 'Name can only contain letters'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup
    .string()
    .matches(/^[0-9\-\+\(\)\s]+$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number is too long')
    .required('Phone number is required'),
});
