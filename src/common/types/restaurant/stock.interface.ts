export interface IStockSuppliers {
    id: string
    title: string
    address: string

    auto_order?: IStockSupplierAutoOrder
    bank_details?: IStockSupplierBank

    orders_controller: IStockOrdersController[]
    contacts: IStockSupplierContacts[]
    categories: IStockCategories[]
    products: IStockProducts[]

    spent: number

    created_at: Date
    updated_at: Date
}

export interface IStockSupplierBank {
    id: string
    title: string

    iban: string
    bic: string

    supplier_id: string
    supplier: IStockSuppliers

    created_at: Date
    updated_at: Date
}

export interface IStockSupplierContacts {
    id: string

    name: string
    email?: string
    contact_numer?: string

    supplier_id: string
    supplier: IStockSuppliers

    created_at: Date
    updated_at: Date

}

export interface IStockSupplierAutoOrder {
    id: string

    week_day: string
    email: string
    last_order_date?: Date

    supplier_id: string
    supplier: IStockSuppliers

    created_at: Date
    updated_at: Date
}

export interface IStockCategories {
    id: string
    title: string

    suppliers: IStockSuppliers[]
    sub_categories: IStockSubCategories[]

    created_at: Date
    updated_at: Date
}

export interface IStockSubCategories {
    id: string
    title: string

    category: IStockCategories
    category_id: string

    created_at: Date
    updated_at: Date
}


export enum StockItemTypes {
    UNIT = 'unt',
    WEIGHT = 'wgt',
    VOLUME = 'vol',
    LITRE = 'lt',
    KG = 'kg',
    ML = 'ml',
    GR = 'gr',
    ROLL = 'roll',
    PIECE = 'piece',
    KW = 'kw',
}

export interface IStockItem {
    id: string
    title: string
    stock: number
    max_stock: number
    min_stock: number
    type: StockItemTypes

    last_order_date?: Date
    last_order_price?: number

    category: IStockCategories
    category_id: string

    sub_category: IStockSubCategories
    sub_category_id: string

    products: IStockProducts[]
    orders: IStockOrders[]

    created_at: Date
    updated_at: Date
}

export interface IStockProducts {
    id: string
    title: string
    code: string
    pack_quantity: number

    supplier: IStockSuppliers
    supplier_id: string

    orders: IStockOrders[]

    created_at: Date
    updated_at: Date
}

// export enum StockOrderStatus {
//     DELIVERED = 'delivered',
//     ORDERED = 'ordered',
// }
export interface IStockOrders {
    id: string
    title: string   // ISotckItems / title

    supplier: string // IStockSuppliers / title

    product: IStockProducts
    product_id: string

    product_quantity: number //default 0

    deposit: number //default 0
    price_per_unit: number //default 0	
    vat: number //default 0
    total: number // (product_quantity * price_per_unit) * vat  //default 0

    delivery_date?: Date

    // status: StockOrderStatus // default ordered

    order_controller: IStockOrdersController
    order_controller_id: string

    created_at: Date
    updated_at: Date
}

export interface IStockOrdersController {
    id: string

    orders: IStockOrders[]
    paid: boolean // default false

    supplier: IStockSuppliers
    supplier_id: string

    total: number // sum of orders total (vat included)

    created_at: Date
    updated_at: Date
}

// export interface IStockUsage {
//     id: string
//     usage: number
//     date: Date

//     item: IStockItem
//     item_id: string

//     created_at: Date
//     updated_at: Date
// }