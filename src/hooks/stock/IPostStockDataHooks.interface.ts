import { IStockCategories, IStockItem, IStockSubCategories, IStockSupplierAutoOrder, IStockSupplierBank, IStockSupplierContacts, IStockSuppliers } from "@/common/types/restaurant/stock.interface"

export interface IPOSTStockSuppliersBody {
  title: string;
  address: string;
  connect: {
    categories: {
      id: string[]
    }
  }
}

export interface IPOSTStockItemBody {
  title: string;
  max_stock: number
  min_stock: number
  unit: string
  volume: number
  category_id: string
  sub_category_id: string
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
  email?: string;
  contact_number?: string;
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

export interface IPOSTCreateOrder {
  item_id: string
  supplier: string
  product_id: string
  product_quantity: number
  volume_quantity: number
  supplier_id: string
}

export interface IPOSTStockOrderBody {
  one?: IPOSTCreateOrder
  many?: {
    orders: IPOSTCreateOrder[],
    supplier_id: string
  }
}

export interface IPOSTStockOrderControllerBody {
  paid: boolean;
  supplier_id: string;
  total: number
}

export interface IPOSTStockExtraItemEntryBody {
  item_id: string;
  quantity: number;
  description?: string;
  entry_by_id: string;
  entry_by: string
  new_stock: number;
  old_stock: number;
}

export type IPOSTStockDataQueryType = 'SUPPLIERS' | 'ITEM' | 'SUPPLIER_BANK' | 'SUPPLIER_CONTACT' | 'SUPPLIER_AUTO_ORDER' | 'CATEGORY' | 'SUB_CATEGORY' | 'PRODUCT' | 'ORDER' | 'ORDER_CONTROLLER' | 'EXTRA_ITEM_ENTRY'

export type IPOSTStockDataRerturn = IStockSuppliers | IStockItem | IStockSupplierBank | IStockSupplierContacts | IStockSupplierAutoOrder | IStockCategories | IStockSubCategories | IPOSTStockProductBody | IPOSTStockOrderBody | IPOSTStockOrderControllerBody | IPOSTStockExtraItemEntryBody

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
  order_controller?: IPOSTStockOrderControllerBody
  extra_item_entry?: IPOSTStockExtraItemEntryBody
}
