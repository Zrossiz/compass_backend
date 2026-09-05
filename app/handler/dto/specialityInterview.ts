import * as z from 'zod';

export const SpecialityInterviewDTO = z
  .object({
    specialityId: z.number().int().positive(),
    title: z.string().trim().min(1).max(255),
    videoLink: z.string().trim().url().max(255),
    order: z.number().int().nonnegative(),
  })
  .strict();
