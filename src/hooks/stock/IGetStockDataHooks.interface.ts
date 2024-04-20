import { IStockCategories, IStockExtraItemEntry, IStockItem, IStockOrders, IStockOrdersController, IStockProducts, IStockSubCategories, IStockSupplierAutoOrder, IStockSupplierBank, IStockSupplierContacts, IStockSuppliers } from "@/common/types/restaurant/stock.interface";
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
    category?: {
      in: string[]
    }
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
    unit?: string;
    include?: {
      products?: "1";
      extra_entries?: "1";
      history?: "1";
      category?: "1";
      sub_category?: "1";
      item?: "1";
    };
    category?: {
      id: string[]
    }
    sub_category?: {
      id: string[]
    }
    item?: {
      id: string;
    }
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
      extra_entries?: "1";
      history?: "1";
      category?: "1";
      sub_category?: "1";
      item?: "1";
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

export interface IGETAllStockCategoryResponse {
  data: IStockCategories[];
  pagination: IPaginationResponse
}
export interface IGETStockCategoryQuery {
  all?: {
    title?: string;
    include?: {
      supplier?: "1";
      sub_categories?: '1'
    };
    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof IStockCategories;
      order: "asc" | "desc";
    };
  },
  byId?: {
    id: string;
    include?: {
      supplier?: "1";
      sub_categories?: '1'
    };
  };
}

export interface IGETAllStockSubCategoryResponse {
  data: IStockSubCategories[];
  pagination: IPaginationResponse
}

export interface IGETStockSubCategoryQuery {
  all?: {
    title?: string;
    include?: {
      category?: "1";
    };
    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof IStockSubCategories;
      order: "asc" | "desc";
    };
  },
  byId?: {
    id: string;
    include?: {
      category?: "1";
    };
  };
}

export interface IGETAllStockProductsResponse {
  data: IStockProducts[];
  pagination: IPaginationResponse
}

export interface IGETStockProductQuery {
  all?: {
    title?: string;
    code?: string;
    supplier_id?: {
      in: string[];
    }
    include?: {
      supplier?: "1";
      item?: "1";
      orders?: '1' | {
        date?: {
          gte: Date;
          lte: Date;
        },
        delivery_date?: '1' | '0' | {
          gte: Date;
          lte: Date;
        }
      }
    };
    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof IStockProducts;
      order: "asc" | "desc";
    };
  },
  byId?: {
    id: string;
    include?: {
      supplier?: "1";
      item?: "1";
      orders?: '1' | {
        date?: {
          gte: Date;
          lte: Date;
        }
      }
    };
  };
}

export interface IGETAllStockOrderResponse {
  data: IStockOrders[];
  pagination: IPaginationResponse
}

export interface IGETStockOrderQuery {
  all?: {
    supplier?: string;

    product_id?: string

    item?: {
      title?: string;
      id: string[]
    }

    delivery_date?: {
      gte: string;
      lte: string;
    }

    include?: {
      product?: '1'
      order_controller?: '1'
      item?: '1'
    };
    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof IStockOrders;
      order: "asc" | "desc";
    };
  },
  byId?: {
    id: string;
    include?: {
      product?: '1'
      order_controller?: '1'
      item?: '1'
    };
  };
}

export interface IGETAllStockOrderControllerResponse {
  data: IStockOrdersController[];
  pagination: IPaginationResponse
}

export interface IGETStockOrderControllerQuery {
  all?: {
    paid?: '1' | '0';

    supplier?: {
      title?: string;
      id?: string[]
    }

    date?: {
      gte: string;
      lte: string;
    }

    include?: {
      orders?: '1'
      supplier?: '1'
    };

    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof IStockOrdersController;
      order: "asc" | "desc";
    };
  },
  byId?: {
    id: string;
    include?: {
      orders?: '1'
      supplier?: '1'
    };

  };
}

export interface IGETAllStockExtraItemEntryResponse {
  data: IStockOrdersController[];
  pagination: IPaginationResponse
}

export interface IGETStockExtraItemEntryQuery {
  all?: {
    entry_by?: string
    item_id?: {
      in: string[]
    }
    include?: {
      item: '1'
    };
    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof IStockExtraItemEntry
      order: "asc" | "desc";
    };
  },
  byId?: {
    id: string;
    include?: {
      item: '1'
    };
  };
}

export type IGETStockResponse = IGETAllIStockSuppliersResponse | IStockSuppliers | IGETAllIStockItemResponse | IStockItem | IGETAllStockSupplierBankResponse | IStockSupplierBank | IGETAllStockSupplierContactsResponse | IStockSupplierContacts | IGETAllStockSupplierAutoOrderResponse | IStockSupplierAutoOrder | IGETAllStockCategoryResponse | IStockCategories | IGETAllStockSubCategoryResponse | IStockSubCategories | IGETAllStockProductsResponse | IStockProducts | IGETAllStockOrderResponse | IStockOrders | IGETAllStockOrderControllerResponse | IStockOrdersController | IGETAllStockExtraItemEntryResponse | IStockExtraItemEntry

export type IStockDataQueryType = 'SUPPLIERS' | 'ITEM' | 'SUPPLIER_BANK' | 'SUPPLIER_CONTACT' | 'SUPPLIER_AUTO_ORDER' | 'CATEGORY' | 'SUB_CATEGORY' | 'PRODUCT' | 'ORDER' | 'ORDER_CONTROLLER' | 'EXTRA_ITEM_ENTRY'

export interface IGETStockDataQuery {
  supplier?: IGETStockSuppliersQuery
  item?: IGETStockItemQuery
  bank?: IGETStockSupplierBankQuery
  contacts?: IGETStockSupplierContactsQuery
  auto_order?: IGETStockSupplierAutoOrderQuery
  category?: IGETStockCategoryQuery
  sub_category?: IGETStockSubCategoryQuery
  product?: IGETStockProductQuery
  order?: IGETStockOrderQuery
  order_controller?: IGETStockOrderControllerQuery
  extra_item_entry?: IGETStockExtraItemEntryQuery
}

