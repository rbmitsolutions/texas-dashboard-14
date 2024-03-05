import { IAddOnsCreateOrder } from "@/store/restaurant/order";
import { IMenuType } from "./menu.interface";
import { IFinishedTable, ITable } from "./tables.interface";

export type IOrderStatus = "ordered" | "cancelled" | "returned" | "delivered";

export interface IOrder {
  id: string;

  status: IOrderStatus;
  quantity: number;

  mn_type: IMenuType;

  price: number;
  
  menu: string;
  menu_id: string;
  menu_short_title: string
  
  add_ons: IAddOnsCreateOrder[]

  to_print_ids: string[];

  order_controller: IOrderController;
  order_controller_id: string;

  created_at: Date;
  updated_at: Date;
}

export interface IOrderController {
  id: string;
  number: number

  waiter: string;
  waiter_id: string;

  client_id: string;

  table: ITable | null;
  table_id: string | null;

  finished_table: IFinishedTable | null;
  finished_table_id: string | null;

  orders: IOrder[];

  created_at: Date;
  updated_at: Date;
}
