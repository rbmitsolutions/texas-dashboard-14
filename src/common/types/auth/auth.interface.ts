export enum Permissions {
  MY_PROFILE = "my_profile",

  ADMIN = "admin",
  ADMIN_GHOST = "admin-ghost",

  BOOKING_READER = "booking_reader",
  BOOKING_PAGINATION = "booking_pagination",
  BOOKING_ADM = "booking_adm",

  RECEPTION = "reception",
  PASS = "pass",
  ORDERS = "orders",
  WAITERS = "waiters",

  HACCP_ADMIN = "haccp_admin",

  MENU = 'menu',
  MENU_CREATE = 'menu_create',
  MENU_UPDATE = 'menu_update',
  MENU_DELETE = 'menu_delete',

  SEND_EMAIL = 'send_email',
  SEND_SMS = 'send_sms',

  ROSTER_TASKS = 'roster_tasks',
  DAY_ROSTER = 'day_roster',

  STOCK_MANAGER = 'stock_manager',
  STOCK_TAKE = 'stock_take',
}

export interface IToken {
  user_id: string;
  token: string;
  name: string;
  profile_image: string;
  permissions: Permissions[];
  roster_password: number;
  authorized_device: boolean
  refresh_token: {
    id: string
  }
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

export enum HistoryType {
  BookingTime = 'Close / Open Booking Time',
  BookingDeleted = 'Booking Deleted',
  MenuUpdated = 'Menu Updated',
  MenuCreated = 'Menu Created',
  TaskAdded = 'Task - Added',
  TaskDeleted = 'Task - Deleted',
}
export interface IHistory {
  id: string;

  by: string
  by_id: string
  type: HistoryType
  description: string;

  created_at: Date;
}

