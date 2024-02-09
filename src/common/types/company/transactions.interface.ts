export type ITransactionsType =
  | "open-table"
  | "closed-table"
  | "buy-gift-card"
  | "payroll"
  | "adjustment"
  | "tips"
  | "holiday"
  | "bank holiday pay";

export type ITransactionsMethod = "cash" | "card" | "payroll" | "gift-card";

export type ITransactionsDirection = "in" | "out" | 'voucher' // voucher will be used for gift card transactions

export type ITransactionsStatus = "confirmed" | "cancelled";

export interface ITransactions {
  id: string;
  type: ITransactionsType;
  method: ITransactionsMethod;
  direction: ITransactionsDirection;

  status: ITransactionsStatus;

  gift_card_id?: string;

  total: number;
  description?: string;

  valid_by?: string;
  valid_by_id?: string;

  payee?: string; // "client`s name" "table`s number" "employee`s name"
  payee_key?: string; // "client`s id" "tables`s is" "employee`s id"

  created_at: Date;
  updated_at: Date;
}
