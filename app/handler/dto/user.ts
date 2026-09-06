import * as z from 'zod';

export const UserDTO = z
  .object({
    username: z.string().trim().min(1).max(40),
    password: z
      .string()
      .min(8)
      .refine((password) => Buffer.byteLength(password, 'utf8') <= 72, {
        message: 'Password must be at most 72 bytes',
      }),
  })
  .strict();

export const RefreshTokenCookieDTO = z.object({
  refreshToken: z.string().min(1),
});

export type UserRes = {
  id: number;
  username: string;
  createdAt: Date;
};
