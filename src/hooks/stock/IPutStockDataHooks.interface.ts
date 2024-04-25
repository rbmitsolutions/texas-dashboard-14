import { IPOSTFormDataBody } from "../company/IPostCompanyDataHooks.interface";

export interface IPUTStockSuppliersBody {
    id: string;
    title?: string;
    address?: string;
    connect?: {
        categories?: {
            id: string[]
        }
    }
    disconnect?: {
        categories?: {
            id: string[]
        }
    }
}

export interface IPUTStockItemBody {
    id: string;
    title?: string;
    stock?: number
    max_stock?: number
    min_stock?: number
    unit?: string
    volume?: number
    category_id?: string
    sub_category_id?: string
    connect?: {
        products?: {
            id: string[]
        },
    },
    disconnect?: {
        products?: {
            id: string[]
        },
    },
}

export interface IPUTStockSupplierBankBody {
    id: string;
    title?: string;
    iban?: string;
    bic?: string;
    supplier_id?: string;
}

export interface IPUTStockSupplierContactsBody {
    id: string;
    name?: string;
    email?: string;
    contact_number?: string;
    suppler_id?: string;
}

export interface IPUTStockSupplierAutoOrderBody {
    id: string;
    week_day?: string;
    email?: string;
}

export interface IPUTStockCategoryBody {
    id: string;
    title: string;
    connect?: {
        supplier?: {
            id: string[]
        };
        sub_categories?: {
            id: string[]
        };
    }
    disconnect?: {
        supplier?: {
            id: string[]
        };
        sub_categories?: {
            id: string[]
        };
    }
}

export interface IPUTStockSubCategoryBody {
    id: string;
    title: string;
    category_id: string;
}

export interface IPUTStockProductBody {
    id: string;
    title?: string;
    code?: string;
    pack_quantity?: number;
    supplier_id?: string;
    item_id?: string;
}

export interface IPUTStockOrderBody {
    id: string;
    item_id?: string
    supplier?: string
    product_id?: string
    product_quantity?: number
    volume_quantity?: number
    deposit?: number
    vat?: number
    total?: number
    delivery_date?: Date
    haccp_data_id?: string

    haccp?: IPOSTFormDataBody

    //auto update
    one_product_price?: number
    one_volume_price?: number
    product_price?: number
}

export interface IPUTStockOrderControllerBody {
    id: string;
    paid?: boolean;
    supplier_id?: string;
    total?: number;
}

export interface IPUTStockItemHistoryBody {
    id: string;
    item_id?: string;
    quantity?: number;
    menu_id?: string;
    order_id?: string;
}

export type IPUTStockDataQueryType = 'SUPPLIERS' | 'ITEM' | 'SUPPLIER_BANK' | 'SUPPLIER_CONTACT' | 'SUPPLIER_AUTO_ORDER' | 'CATEGORY' | 'SUB_CATEGORY' | 'PRODUCT' | 'ORDER' | 'ORDER_CONTROLLER' | 'ITEM_HISTORY'
export interface IPUTStockBody {
    supplier?: IPUTStockSuppliersBody
    item?: IPUTStockItemBody
    bank?: IPUTStockSupplierBankBody
    contact?: IPUTStockSupplierContactsBody
    auto_order?: IPUTStockSupplierAutoOrderBody
    category?: IPUTStockCategoryBody
    sub_category?: IPUTStockSubCategoryBody
    product?: IPUTStockProductBody
    order?: IPUTStockOrderBody
    order_controller?: IPUTStockOrderControllerBody
    item_history?: IPUTStockItemHistoryBody
}
