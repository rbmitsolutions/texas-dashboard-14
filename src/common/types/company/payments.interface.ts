export type IPaymentsType =
    | "payroll"
    | "adjustment"
    | "tips"
    | "holiday"
    | "bank holiday pay";

export interface IPayments {
    id?: string;
    date: Date;
    payee: string;
    description?: string;
    type: string;
    total: number;
    file?: string;
    file_id?: string;
    key?: string;
}
