import * as z from 'zod';

export const ProfessionInterviewDTO = z
  .object({
    professionId: z.number().int().positive(),
    title: z.string().trim().min(1).max(255),
    videoLink: z.string().trim().url().max(255),
    order: z.number().int().nonnegative(),
  })
  .strict();
