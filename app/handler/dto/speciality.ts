import * as z from 'zod';

export const SpecialityDTO = z.object({
  professionId: z.number(),
  title: z.string().min(3).max(300),
  description: z.string(),
});
