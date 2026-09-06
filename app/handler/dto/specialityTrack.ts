import * as z from 'zod';

export const SpecialityTrackDTO = z
  .object({
    specialityId: z.coerce.number().int().positive(),
    title: z.string().trim().min(1).max(255),
    sortOrder: z.coerce.number().int().nonnegative(),
  })
  .strict();

export const SpecialityTrackFileDTO = z.custom<Express.Multer.File>(
  (file) =>
    typeof file === 'object' &&
    file !== null &&
    'mimetype' in file &&
    ['image/jpeg', 'image/png', 'image/webp'].includes(String(file.mimetype)),
);
