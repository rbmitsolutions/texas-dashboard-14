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


export type IPOSTStockDataQueryType = 'SUPPLIERS' | 'ITEM' | 'SUPPLIER_BANK' | 'SUPPLIER_CONTACT' | 'SUPPLIER_AUTO_ORDER' | 'CATEGORY' | 'SUB_CATEGORY'

export type IPOSTStockDataRerturn = IStockSuppliers | IStockItem | IStockSupplierBank | IStockSupplierContacts | IStockSupplierAutoOrder | IStockCategories | IStockSubCategories

export interface IPOSTStockBody {
  supplier?: IPOSTStockSuppliersBody
  item?: IPOSTStockItemBody
  bank?: IPOSTStockSupplierBankBody
  contact?: IPOSTStockSupplierContactsBody
  auto_order?: IPOSTStockSupplierAutoOrderBody
  category?: IPOSTStockCategoryBody
  sub_category?: IPOSTStockSubCategoryBody
}
