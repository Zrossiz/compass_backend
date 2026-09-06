import * as z from 'zod';

export const UniversityDTO = z
  .object({
    title: z.string().trim().min(2).max(255),
    region: z.string().trim().min(2).max(255),
    description: z.string().trim().min(1).max(10_000),
  })
  .strict();
