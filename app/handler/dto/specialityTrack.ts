import * as z from 'zod';

export const SpecialityTrackDTO = z
  .object({
    specialityId: z.coerce.number().int().positive(),
    title: z.string().trim().min(1).max(255),
    sortOrder: z.string().trim().regex(/^\d+$/),
  })
  .strict();
