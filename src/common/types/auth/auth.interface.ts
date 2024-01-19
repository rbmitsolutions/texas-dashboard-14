export type IPermissions =
  | "my_profile"
  | "admin"
  | "admin-ghost"
  | "reception"
  | "booking_reader"
  | 'booking_pagination'
  | "booking_adm"
  | "tables"
  | "pass"
  | "orders"
  | "haccp_admin"
  | "waiters"
  | 'day_roster'

//token from texas-dashboard does not have roster-password
export interface IToken {
  user_id: string;
  token: string;
  refresh_token: any;
  name: string;
  profile_image: string;
  permissions: IPermissions[];
}

export interface IRefreshToken {
  id: string;
  expiresIn: number;
  user_id: string;
}

export interface ITokens {
  id: string;
  type: string;
  expiresIn: number;
}
