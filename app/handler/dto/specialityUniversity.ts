import * as z from 'zod';

export const SpecialityUniversityDTO = z
  .object({
    universityId: z.number().int().positive(),
    specialityId: z.number().int().positive(),
  })
  .strict();
