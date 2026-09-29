import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  address: z.string().max(400),
  ownerId: z.number().int().positive().optional(),
});

export const ratingSchema = z.object({
  ratingValue: z.number().int().min(1).max(5),
});
