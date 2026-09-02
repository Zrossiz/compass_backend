import * as z from 'zod';

export const ProfessionDTO = z.object({
  title: z.string().trim().min(3).max(300),
  description: z.string().min(8),
});
