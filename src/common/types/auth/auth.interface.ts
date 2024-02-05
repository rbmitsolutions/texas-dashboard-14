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
  MENU_DELETE = 'menu-delete',
  SEND_EMAIL = 'send-email',
  SEND_SMS = 'send-sms',
}

//token from texas-dashboard does not have roster-password
export interface IToken {
  user_id: string;
  token: string;
  refresh_token: {
    id:string
  }
  name: string;
  profile_image: string;
  permissions: Permissions[];
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
