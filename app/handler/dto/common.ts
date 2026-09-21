import * as z from 'zod';

export const IdParamsDTO = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

export const PaginationQueryDTO = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().positive().default(1),
});

export const SearchQueryDTO = z.object({
  search: z.string().trim().max(255).default(''),
  sphereId: z.coerce.number().int().positive(),
});
