import { IStockItem, IStockSupplierAutoOrder, IStockSupplierBank, IStockSupplierContacts, IStockSuppliers } from "@/common/types/restaurant/stock.interface";
import { IPaginationResponse, IQueryPagination } from "@/common/types/settings.interface";

export interface IGETAllIStockSuppliersResponse {
  data: IStockSuppliers[];
  pagination: IPaginationResponse
}

export interface IGETStockSuppliersQuery {
  byId?: {
    id: string;
    include?: {
      oc?: "1";
      contacts?: "1";
      categories?: "1";
      products?: "1";
      auto_order?: "1";
      bank?: "1";
    };
  };
  all?: {
    title?: string;
    include?: {
      oc?: "1";
      contacts?: "1";
      categories?: "1";
      products?: "1";
      auto_order?: "1";
      bank?: "1";
    };
    pagination?: IQueryPagination
    orderBy?: {
      key: keyof IStockSuppliers;
      order: "asc" | "desc";
    };
  },
}

export interface IGETAllIStockItemResponse {
  data: IStockItem[];
  pagination: IPaginationResponse
}

export interface IGETStockItemQuery {
  all?: {
    title?: string;
    type?: string;
    include?: {
      products?: "1";
    };
    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof IStockItem;
      order: "asc" | "desc";
    };
  },
  byId?: {
    id: string;
    include?: {
      products?: "1";

    };
  };
}

export interface IGETAllStockSupplierBankResponse {
  data: IStockSupplierBank[];
  pagination: IPaginationResponse
}

export interface IGETStockSupplierBankQuery {
  all?: {
    title?: string;
    iban?: string;
    bic?: string;
    include?: {
      supplier?: "1";
    };
    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof IStockSupplierBank
      order: "asc" | "desc";
    };
  },
  byId?: {
    id: string;
    include?: {
      supplier?: "1";
    };
  };
}

export interface IGETAllStockSupplierContactsResponse {
  data: IStockSupplierContacts[];
  pagination: IPaginationResponse
}

export interface IGETStockSupplierContactsQuery {
  all?: {
    name?: string;
    email?: string;
    contact_number?: string;
    supplier_id?: string;

    include?: {
      supplier?: "1";
    };

    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof IStockSupplierContacts
      order: "asc" | "desc";
    };
  },
  byId?: {
    id: string;
    include?: {
      supplier?: "1";
    };
  };
}

export interface IGETAllStockSupplierAutoOrderResponse {
  data: IStockSupplierAutoOrder[];
  pagination: IPaginationResponse
}


export interface IGETStockSupplierAutoOrderQuery {
  all?: {
    week_day?: string;
    include?: {
      supplier?: "1";
    };
    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof IStockSupplierAutoOrder
      order: "asc" | "desc";
    };
  },
  byId?: {
    id: string;
    include?: {
      supplier?: "1";
    };
  };
}

export type IGETStockResponse = IGETAllIStockSuppliersResponse | IStockSuppliers | IGETAllIStockItemResponse | IStockItem | IGETAllStockSupplierBankResponse | IStockSupplierBank | IGETAllStockSupplierContactsResponse | IStockSupplierContacts | IGETAllStockSupplierAutoOrderResponse | IStockSupplierAutoOrder

export type IStockDataQueryType = 'SUPPLIERS' | 'ITEM' | 'SUPPLIER_BANK' | 'SUPPLIER_CONTACT' | 'SUPPLIER_AUTO_ORDER'

export interface IGETStockDataQuery {
  supplier?: IGETStockSuppliersQuery
  item?: IGETStockItemQuery
  bank?: IGETStockSupplierBankQuery
  contacts?: IGETStockSupplierContactsQuery
  auto_order?: IGETStockSupplierAutoOrderQuery
}

