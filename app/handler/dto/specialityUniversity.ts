import * as z from 'zod';

export const SpecialityUniversityDTO = z.object({
  universityId: z.number(),
  specialityId: z.number(),
});
