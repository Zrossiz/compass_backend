import * as z from 'zod';

export const SpecialityDTO = z
  .object({
    professionId: z.number().int().positive(),
    title: z.string().trim().min(3).max(255),
    description: z.string().trim().min(1).max(10_000),
  })
  .strict();

export const SpecialitySearchQueryDTO = z.object({
  professionId: z.preprocess(
    (value) => (value === undefined || value === '' ? null : value),
    z.coerce.number().int().positive().nullable(),
  ),
});
