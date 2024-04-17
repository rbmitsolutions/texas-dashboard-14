import { IStockCategories, IStockItem, IStockSubCategories, IStockSupplierAutoOrder, IStockSupplierBank, IStockSupplierContacts, IStockSuppliers } from "@/common/types/restaurant/stock.interface"

export interface IPOSTStockSuppliersBody {
  title: string;
  address: string;
}

export interface IPOSTStockItemBody {
  title: string;
  stock: number
  max_stock: number
  min_stock: number
  type: string
  connect?: {
    products?: {
      id: string[]
    },
  },
}

export interface IPOSTStockSupplierBankBody {
  title: string;
  iban: string;
  bic: string;
  supplier_id: string;
}

export interface IPOSTStockSupplierContactsBody {
  name: string;
  email: string;
  contact_number: string;
  supplier_id: string;
}

export interface IPOSTStockSupplierAutoOrderBody {
  week_day: string;
  email: string;
  supplier_id: string;
}

export interface IPOSTStockCategoryBody {
  title: string;
  connect?: {
    supplier?: {
      id: string[]
    };
    sub_categories?: {
      id: string[]
    };
  };
}

export interface IPOSTStockSubCategoryBody {
  title: string;
  category_id: string;
}

export interface IPOSTStockProductBody {
  title: string;
  code: string;
  pack_quantity: number;
  supplier_id: string;
  item_id: string;
}

export interface IPOSTStockOrderBody {
  title: string
  supplier: string
  product_id: string
  product_quantity: number
  total_quantity: number
  deposit?: number
  price_per_unit: number
  vat: number
  total: number
  delivery_date?: Date
  order_controller_id: string
}

export type IPOSTStockDataQueryType = 'SUPPLIERS' | 'ITEM' | 'SUPPLIER_BANK' | 'SUPPLIER_CONTACT' | 'SUPPLIER_AUTO_ORDER' | 'CATEGORY' | 'SUB_CATEGORY' | 'PRODUCT' | 'ORDER'

export type IPOSTStockDataRerturn = IStockSuppliers | IStockItem | IStockSupplierBank | IStockSupplierContacts | IStockSupplierAutoOrder | IStockCategories | IStockSubCategories | IPOSTStockProductBody | IPOSTStockOrderBody
export interface IPOSTStockBody {
  supplier?: IPOSTStockSuppliersBody
  item?: IPOSTStockItemBody
  bank?: IPOSTStockSupplierBankBody
  contact?: IPOSTStockSupplierContactsBody
  auto_order?: IPOSTStockSupplierAutoOrderBody
  category?: IPOSTStockCategoryBody
  sub_category?: IPOSTStockSubCategoryBody
  product?: IPOSTStockProductBody
  order?: IPOSTStockOrderBody
}
