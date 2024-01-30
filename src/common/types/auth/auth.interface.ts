export enum Permissions {
  MY_PROFILE = "my_profile",
  ADMIN = "admin",
  ADMIN_GHOST = "admin-ghost",
  RECEPTION = "reception",
  BOOKING_READER = "booking_reader",
  BOOKING_PAGINATION = "booking_pagination",
  BOOKING_ADM = "booking_adm",
  TABLES = "tables",
  PASS = "pass",
  ORDERS = "orders",
  HACCP_ADMIN = "haccp_admin",
  WAITERS = "waiters",
  DAY_ROSTER = 'day_roster',
  MENU = 'menu',
  MENU_CREATE = 'menu-create',
  MENU_UPDATE = 'menu-update',
  MENU_DELETE = 'menu-delete'
}
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
  | 'menu'
  | 'menu-create'
  | 'menu-update'
  | 'menu-delete'

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
