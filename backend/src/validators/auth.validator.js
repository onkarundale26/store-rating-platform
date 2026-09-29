import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

export const signupSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().regex(passwordRegex, 'Password must be 8-16 characters long, contain at least one uppercase letter and one special character'),
  address: z.string().max(400),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().regex(passwordRegex, 'Password must be 8-16 characters long, contain at least one uppercase letter and one special character'),
});
