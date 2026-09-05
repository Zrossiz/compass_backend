import * as z from 'zod';

export const UniversityDTO = z.object({
  title: z.string(),
  region: z.string(),
});
