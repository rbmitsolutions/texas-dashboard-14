import { IMenuType } from "./menu.interface";
import { IFinishedTable, ITable } from "./tables.interface";

export type IOrderStatus = "ordered" | "cancelled" | "returned" | "delivered";

export interface IOrder {
  id: string;

  status: IOrderStatus;
  quantity: number;

  type: string;
  menu_type: IMenuType;

  price: number;
  description: string;

  menu: string;
  menu_id: string;

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
