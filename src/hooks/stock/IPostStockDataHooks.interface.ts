import { IStockItem, IStockSupplierAutoOrder, IStockSupplierBank, IStockSupplierContacts, IStockSuppliers } from "@/common/types/restaurant/stock.interface"

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


export type IPOSTStockDataQueryType = 'SUPPLIERS' | 'ITEM' | 'SUPPLIER_BANK' | 'SUPPLIER_CONTACT' | 'SUPPLIER_AUTO_ORDER'

export type IPOSTStockDataRerturn = IStockSuppliers | IStockItem | IStockSupplierBank | IStockSupplierContacts | IStockSupplierAutoOrder

export interface IPOSTStockBody {
  supplier?: IPOSTStockSuppliersBody
  item?: IPOSTStockItemBody
  bank?: IPOSTStockSupplierBankBody
  contact?: IPOSTStockSupplierContactsBody
  auto_order?: IPOSTStockSupplierAutoOrderBody
}
