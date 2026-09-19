import * as z from 'zod';

export const ProfessionDTO = z
  .object({
    sphereId: z.number().int().positive(),
    title: z.string().trim().min(3).max(255),
    description: z.string().trim().min(8).max(10_000),
  })
  .strict();
