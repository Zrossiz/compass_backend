import * as z from 'zod';

export const SphereDTO = z
  .object({
    title: z.string().trim().min(3).max(255),
    description: z.string().trim().min(8).max(10_000),
  })
  .strict();
