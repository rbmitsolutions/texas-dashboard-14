export interface IPUTStockSuppliersBody {
    id: string;
    title?: string;
    address?: string;
}

export interface IPUTStockItemBody {
    id: string;
    title?: string;
    stock?: number
    max_stock?: number
    min_stock?: number
    type?: string
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
    title?: string
    supplier?: string
    product_id?: string
    product_quantity?: number
    total_quantity?: number
    deposit?: number
    price_per_unit?: number
    vat?: number
    total?: number
    delivery_date?: Date
    order_controller_id?: string
}

export type IPUTStockDataQueryType = 'SUPPLIERS' | 'ITEM' | 'SUPPLIER_BANK' | 'SUPPLIER_CONTACT' | 'SUPPLIER_AUTO_ORDER' | 'CATEGORY' | 'SUB_CATEGORY' | 'PRODUCT' | 'ORDER'

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
}
