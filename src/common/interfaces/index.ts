export enum RedisKeys {
  USER_KEY_PREFIX = 'user:',
  USER_LIST = 'user:list',
}

export type JwtPayload = {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
};

export type RefreshToken = {
  id: number | bigint;
  refreshToken: string;
  expires: number;
};
