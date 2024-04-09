import { IBookingDays, ISpecialDays } from "./config.interface";
import { IOrderController } from "./order.interface";

export interface ISection {
  id: string;

  title: string;
  open: boolean;
  priority: number;

  tables: ITable[];
  days_open: IBookingDays[]
  special_days: ISpecialDays[]

  created_at: Date;
  updated_at: Date;
}

export interface IFinishedTable {
  id: string;

  date: Date;
  table_id: string;
  section_id: string;
  client_id: string;
  client: string;
  booking_id?: string;

  start_time: Date;
  end_time: Date;
  average_minutes: number;
  guests: number;
  guests_booked: number;
  pass: number;

  orders_controller: IOrderController[];

  created_at: Date;
  updated_at: Date;
}

export enum TableMealStatus {
  WAITING = "waiting",
  STARTERS = "starters",
  MAIN = "main",
  ALL_TOGETHER = "all together",
  PREPARING = "preparing",
  DESSERT = "dessert",
}
export interface ITable {
  id: string;
  number: number;

  start_time: Date;
  food_ordered_at: Date;
  pass: number;

  meal_status: TableMealStatus;
  is_open: boolean;

  guests: number;
  guests_booked: number;

  booking_id?: string;
  client_id?: string | null;
  client_name?: string | null;
  finished_table_id?: string | null;

  order_controller: IOrderController[];

  section_id: string;
  section: ISection;

  created_at: Date;
  updated_at: Date;
}
