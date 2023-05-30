export interface IUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ICurrentUserRefreshToken {
  refreshToken: string;
  id: number;
  role: string;
}
