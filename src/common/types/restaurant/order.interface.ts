
export type IOrderStatus = "ordered" | "cancelled" | "returned" | "delivered";

export interface IOrderAddOns {
    is_mandatory: boolean,
    title: string,
}

export interface IOrder {
    id: string;

    status: IOrderStatus;
    quantity: number;

    //   type: IMenuType
    //   menu_type: IMenuType;
    add_ons: IOrderAddOns[]

    value: number; // price in cents
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

    //   table: ITable | null;
    //   table_id: string | null;

    //   finished_table: IFinishedTable | null;
    //   finished_table_id: string | null;

    orders: IOrder[];

    created_at: Date;
    updated_at: Date;
}

export interface IExtraSide {
    title: string;
    price: number;
}

export interface IOrderConfig {
    doneness?: string;
    sauce?: {
        title?: string;
        price?: number;
    };
    side?: string;
    extra_side: IExtraSide[];
    notes?: string;
    quantity: number;
    extra_notes: string[];
}
