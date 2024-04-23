export type IDELETEStockDataQueryType = 'SUPPLIERS' | 'ITEM' | 'SUPPLIER_BANK' | 'SUPPLIER_CONTACT' | 'SUPPLIER_AUTO_ORDER' | 'CATEGORY' | 'SUB_CATEGORY' | 'PRODUCT' | 'ORDER' | 'ORDER_CONTROLLER' | 'EXTRA_ITEM_ENTRY'

export interface IDELETEStockDataBody {
  supplier?: {
    id: string;
  }
  item?: {
    id: string;
  }
  bank?: {
    id: string;
  }
  contact?: {
    id: string;
  }
  auto_order?: {
    id: string;
  }
  category?: {
    id: string;
  }
  sub_category?: {
    id: string;
  }
  product?: {
    id: string;
  }
  order?: {
    id: string;
  }
  order_controller?: {
    id: string;
  }
  extra_item_entry?: {
    id: string;
  }
}