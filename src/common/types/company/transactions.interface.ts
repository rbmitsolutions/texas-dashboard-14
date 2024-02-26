export type TransactionsType =
  | TableTransactionsType
  | GiftCardPaymentsType
  | PayrollTransactionsType

export enum TableTransactionsType {
  OPEN_TABLE = "open-table",
  CLOSED_TABLE = "closed-table",
}
export enum GiftCardPaymentsType {
  BUY_GIFT_CARD = "buy-gift-card",
}

export enum PayrollTransactionsType {
  PAYROLL = "payroll",
  ADJUSTMENT = "adjustment",
  TIPS = "tips",
  HOLIDAY = "holiday",
  BANK_HOLIDAY_PAY = "bank holiday pay"
}
export enum TransactionsMethod {
  CASH = "cash",
  CARD = "card",
  PAYROLL = "payroll",
  GIFT_CARD = "gift-card",
}

export enum TransactionsDirection {
  IN = "in",
  OUT = "out",
  VOUCHER = "voucher",
} 
export enum TransactionsStatus {
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export interface ITransactions {
  id: string;
  type: TransactionsType;
  method: TransactionsMethod;
  direction: TransactionsDirection;

  status: TransactionsStatus;

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
