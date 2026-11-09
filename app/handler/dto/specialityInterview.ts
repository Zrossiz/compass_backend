import * as z from 'zod';

export const SpecialityInterviewDTO = z
  .object({
    specialityId: z.number().int().positive(),
    title: z.string().trim().min(1).max(255),
    videoLink: z
      .string()
      .trim()
      .url()
      .max(255)
      .refine((value) => /^https?:\/\//i.test(value), 'Use an HTTP or HTTPS video URL'),
    order: z.number().int().nonnegative(),
  })
  .strict();
