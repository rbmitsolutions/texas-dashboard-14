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

export type IPUTStockDataQueryType = 'SUPPLIERS' | 'ITEM' | 'SUPPLIER_BANK' | 'SUPPLIER_CONTACT' | 'SUPPLIER_AUTO_ORDER' 

export interface IPUTStockBody {
    supplier?: IPUTStockSuppliersBody
    item?: IPUTStockItemBody
    bank?: IPUTStockSupplierBankBody
    contact?: IPUTStockSupplierContactsBody
    auto_order?: IPUTStockSupplierAutoOrderBody
}
