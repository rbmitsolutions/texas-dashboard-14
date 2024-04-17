export type IDELETEStockDataQueryType = 'SUPPLIERS' | 'ITEM' | 'SUPPLIER_BANK' | 'SUPPLIER_CONTACT' | 'SUPPLIER_AUTO_ORDER'
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
}