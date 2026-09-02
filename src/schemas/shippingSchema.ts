import { z } from 'zod';

export const ShippingSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name is too long'),
  email: z.email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]{7,15}$/, 'Please enter a valid phone number'),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(120, 'Address is too long'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z
    .string()
    .regex(/^[A-Za-z0-9\s\-]{3,10}$/, 'Please enter a valid zip/postal code'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
});

export type ShippingFormData = z.infer<typeof ShippingSchema>;
