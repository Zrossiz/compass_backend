import type { UserJWTPayload } from 'app/model/user';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserJWTPayload;
  }
}
