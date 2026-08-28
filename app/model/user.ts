export type User = {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type JwtTokens = {
  access: string;
  refresh: string;
};

export type UserWithJwtTokens = {
  user: User;
  tokens: JwtTokens;
};

export type UserJWTPayload = {
  id: number;
  username: string;
};
