import { IMenuToMake } from "./menu.interface"

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
    contact_number?: string

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
    items: IStockItem[]

    created_at: Date
    updated_at: Date
}

export interface IStockSubCategories {
    id: string
    title: string

    category: IStockCategories
    category_id: string
    items: IStockItem[]

    created_at: Date
    updated_at: Date
}


export enum StockItemUnit {
    GR = 'gr',
    ROLL = 'roll',
    PIECE = 'piece',
    KW = 'kw',
    KG = 'kg',
    ML = 'ml',
    UNIT = 'unt',
    WEIGHT = 'wgt',
    VOLUME = 'vol',
}

export interface IStockItem {
    id: string
    title: string
    stock: number
    max_stock: number
    min_stock: number

    unit: StockItemUnit
    volume: number // default 0 eg: 700ml 250ml 500g 

    last_order_date?: Date
    last_order_one_vol_price?: number // default 0 // 0.02 per ml // (product_unit_price / volume) cents

    category: IStockCategories
    category_id: string

    sub_category: IStockSubCategories
    sub_category_id: string

    products: IStockProducts[]
    menu_to_make: IMenuToMake[]
    extra_entries: IStockExtraItemEntry[]
    history: IStockItemHistory[]
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

    item: IStockItem
    item_id: string

    orders: IStockOrders[]

    created_at: Date
    updated_at: Date
}

export interface IStockOrders {
    id: string

    item: IStockItem
    item_id: string

    supplier: string // IStockSuppliers / title

    product: IStockProducts
    product_id: string

    product_quantity: number //default 0
    volume_quantity: number // product_quantity * item.volume //default 0

    product_price: number //default 0 / product.one_product_price * product_quantity
    one_product_price: number // product_price / product.pack_quantity //default 0
    one_volume_price: number // (product_price / product.pack_quantity) / item.volume //default 0

    deposit: number //default 0
    vat: number //default 0
    total: number // (product_price * product_quantity) + ()deposit +  //default 0 cents

    delivery_date?: Date

    order_controller: IStockOrdersController
    order_controller_id: string

    haccp_data_id?: string

    created_at: Date
    updated_at: Date
}

export interface IStockOrdersController {
    id: string

    orders: IStockOrders[]
    paid: boolean // default false

    supplier: IStockSuppliers
    supplier_id: string

    file_id?: string

    created_at: Date
    updated_at: Date
}

export interface IStockExtraItemEntry {
    id: string
    item: IStockItem
    item_id: string

    quantity: number
    old_stock: number
    new_stock: number

    entry_by: String
    entry_by_id: String

    description?: string

    created_at: Date
    updated_at: Date
}

export interface IStockItemHistory {
    id: string

    item: IStockItem
    item_id: string

    quantity: number
    
    menu: string
    menu_id: string

    order_id: string

    created_at: Date
    updated_at: Date
}