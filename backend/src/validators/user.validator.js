import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

export const createUserSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().regex(passwordRegex, 'Password must be 8-16 characters long, contain at least one uppercase letter and one special character'),
  address: z.string().max(400),
  role: z.enum(['ADMIN', 'NORMAL_USER', 'STORE_OWNER']),
});
