import { IStockCategories, IStockExtraItemEntry, IStockItem, IStockItemHistory, IStockOrders, IStockOrdersController, IStockProducts, IStockSubCategories, IStockSupplierAutoOrder, IStockSupplierBank, IStockSupplierContacts, IStockSuppliers } from "@/common/types/restaurant/stock.interface";
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

export type IStockOrderScalarFieldEnum = 'id' | 'item_id' | 'supplier' | 'product_id' | 'product_quantity' | 'volume_quantity' | 'product_price' | 'one_product_price' | 'one_volume_price' | 'deposit' | 'vat' | 'total' | 'delivery_date' | 'order_controller_id' | 'haccp_data_id' | 'created_at' | 'updated_at'

export interface IGETStockOrderQuery {
  all?: {
    supplier?: string;

    product_id?: string

    item?: {
      title?: string;
      id: string[]
    }

    delivery_date?: {
      gte: Date;
      lte: Date;
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
  analytics?: {
    supplier?: {
      in: string[]
    }

    item?: {
      in: string[]
    }

    product_id?: {
      in: string[]
    }

    delivery_date?: {
      gte: Date;
      lte: Date;
    }

    created_at?: {
      gte: Date;
      lte: Date;
    }

    _sum?: {
      product_quantity?: '1';
      volume_quantity?: '1';
      product_price?: '1';
      one_product_price?: '1';
      one_volume_price?: '1';
      deposit?: '1';
      vat?: '1';
      total?: '1';
    }
    groupBy?: {
      by: IStockOrderScalarFieldEnum[]
    }
    aggregate?: '1'
    count?: '1'
  }
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
      gte: Date;
      lte: Date;
    }

    include?: {
      orders?: '1' | {
        product?: '1'
        item?: '1'
      }
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
      orders?: '1' | {
        product?: '1'
        item?: '1'
      }
      supplier?: '1'
    };
  };
  analytics?: {
    supplier_id?: {
      in: string[]
    }
    date?: {
      gte: string;
      lte: string;
    },

    count?: '1'
    groupByPaid?: '1'
  }
}

export interface IGETAllStockExtraItemEntryResponse {
  data: IStockExtraItemEntry[];
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

export interface IGETAllStockItemHistoryResponse {
  data: IStockItemHistory[];
  pagination: IPaginationResponse
}

export interface IGETStockItemHistoryQuery {
  all?: {
    menu?: string

    item_id?: string[]
    menu_id?: string[]
    order_id?: string[]

    include?: {
      item?: '1'
    };

    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof IStockItemHistory
      order: "asc" | "desc";
    };
  },
}


export type IGETStockResponse = IGETAllIStockSuppliersResponse | IStockSuppliers | IGETAllIStockItemResponse | IStockItem | IGETAllStockSupplierBankResponse | IStockSupplierBank | IGETAllStockSupplierContactsResponse | IStockSupplierContacts | IGETAllStockSupplierAutoOrderResponse | IStockSupplierAutoOrder | IGETAllStockCategoryResponse | IStockCategories | IGETAllStockSubCategoryResponse | IStockSubCategories | IGETAllStockProductsResponse | IStockProducts | IGETAllStockOrderResponse | IStockOrders | IGETAllStockOrderControllerResponse | IStockOrdersController | IGETAllStockExtraItemEntryResponse | IStockExtraItemEntry | IGETAllStockItemHistoryResponse

export type IStockDataQueryType = 'SUPPLIERS' | 'ITEM' | 'SUPPLIER_BANK' | 'SUPPLIER_CONTACT' | 'SUPPLIER_AUTO_ORDER' | 'CATEGORY' | 'SUB_CATEGORY' | 'PRODUCT' | 'ORDER' | 'ORDER_CONTROLLER' | 'EXTRA_ITEM_ENTRY' | 'ITEM_HISTORY'

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
  item_history?: IGETStockItemHistoryQuery
}

