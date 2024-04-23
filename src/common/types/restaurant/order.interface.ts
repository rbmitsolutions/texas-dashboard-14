import { IAddOnsCreateOrder } from "@/store/restaurant/order";
import { IFinishedTable, ITable } from "./tables.interface";


export enum OrderStatus {
  ORDERED = "ordered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
  DELIVERED = "delivered",
  PAID = 'paid'
}

export interface IOrder {
  id: string;

  status: OrderStatus;
  quantity: number;
  paid: number

  mn_type: string;
  mn_section: string;

  price: number;
  total: number

  menu: string;
  menu_id: string;
  menu_short_title: string

  add_ons: IAddOnsCreateOrder[]

  to_print_ips: string[];

  order_controller: IOrderController;
  order_controller_id: string;

  cost_to_make: number;
  
  created_at: Date;
  updated_at: Date;
}

export interface IOrderController {
  id: string;
  number: number
  pass: number

  waiter: string;
  waiter_id: string;

  client_id: string;

  table: ITable | null;
  table_id: string | null;

  finished_table: IFinishedTable | null;
  finished_table_id: string | null;

  total: number
  orders: IOrder[];

  created_at: Date;
  updated_at: Date;
}
