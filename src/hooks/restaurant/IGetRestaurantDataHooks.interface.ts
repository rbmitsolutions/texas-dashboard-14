import { IAuthorizedDevices } from "@/common/types/restaurant/authorizedDevices.interface";
import { IBookingStatus, IBookings, IReviews, IReviewsType } from "@/common/types/restaurant/bookings.interface";
import { IClient } from "@/common/types/restaurant/client.interface";
import { IBookingDays, ISpecialDays, ITimesOpen } from "@/common/types/restaurant/config.interface";
import { IGiftCardStatus, IGiftCards } from "@/common/types/restaurant/giftcard.interface";
import { IMenu, IMenuAddOns, IMenuSection, IMenuType } from "@/common/types/restaurant/menu.interface";
import { IOrder, IOrderController, OrderStatus } from "@/common/types/restaurant/order.interface";
import { IPrinters } from "@/common/types/restaurant/printers.interface";
import { IFinishedTable, ISection, ITable, TableMealStatus } from "@/common/types/restaurant/tables.interface";
import { IPaginationResponse, IQueryPagination } from "@/common/types/settings.interface";

export interface IGETAllBookingsResponse {
  data: IBookings[];
  pagination: IPaginationResponse
}

export interface IGETBookingsQuery {
  byId?: {
    id: string;
    include?: {
      client?: "1";
    };
  };
  all?: {
    date: {
      gte: Date;
      lte: Date;
    };
    client_id?: string;
    weekDay?: string;
    amount_of_people?: number | string;
    amount_per_table?: number | string;
    has_request?: "1";
    status?: IBookingStatus[]

    client?: {
      name?: string;
      email?: string;
      contact_number?: string;
    };

    include?: {
      client?: "1";
      table?: "1";
    };

    pagination?: IQueryPagination
    orderBy?: {
      key: keyof IBookings
      order: "asc" | "desc";
    };
  };
}

export interface IGETTablesAllResponse {
  data: ITable[],
  pagination: IPaginationResponse
}

export interface IGETTablesQuery {
  byId?: {
    id: string;
    include?: {
      section?: "1";
      order_controller?: {
        orders?: {
          status?: OrderStatus[]
        } | '1';
      } | '1';
    };
  };
  all?: {
    number?: number;
    client_name?: string;

    is_open?: boolean;
    is_eating?: boolean;

    section_id?: {
      in: string[];
    }

    meal_status?: {
      in: TableMealStatus[];
    }
    guests?: number;

    include?: {
      payments?: '1'
      section?: "1";
      order_controller?: {
        orders?: {
          status?: OrderStatus
        } | '1';
      } | '1';
    };

    pagination: IQueryPagination

    orderBy?: {
      key: keyof ITable
      order: 'asc' | 'desc';
    };
  };
}

export interface IAllOrdersResponse {
  data: IOrder[];
  pagination: IPaginationResponse
};

// export type OrdersBy = 'id' | 'status' | 'quantity' | 'paid' | 'mn_type' | 'mn_section' | 'price' | 'menu' | 'menu_id' | 'menu_short_title' | 'to_print_ips' | 'order_controller_id' | 'created_at' | 'updated_at'
export interface IGETOrdersQuery {
  byId?: {
    id: string;
    order_controller?: "1";
  };
  all?: {
    status?: OrderStatus[]

    mn_type?: {
      in: string[]
    }
    mn_section?: {
      in: string[]
    }
    menu_id?: string;

    include?: {
      order_controller?: "1";
      add_ons?: "1";
    }
   
    orderBy?: {
      key: keyof IOrder;
      order: "asc" | "desc";
    };
    created_at?: {
      gte: Date
      lte: Date
    }
    pagination: IQueryPagination;
  };
  analytics?: {
    status?: {
      in: OrderStatus[]
    }
    mn_type?: {
      in: string[]
    }
    mn_section?: {
      in: string[]
    }
    created_at: {
      gte: Date
      lte: Date
    }
  }
}

export interface IAllOrderControllerResponse {
  data: IOrderController[];
  pagination: IPaginationResponse
};

export interface IGETOrderControllerQuery {
  byId?: {
    id: string;

    includes?: {
      finished_table?: "1";
      orders?: '1'
      table?: '1'
    }
  };
  all?: {
    table_id?: string;
    finished_table_id?: string | null;
    pass?: number[]

    where?: {
      orders?: {
        mn_type?: string[]
        status: OrderStatus[]
        mn_section?: string[]
      }
    }

    includes?: {
      orders?: '1' | {
        mn_type?: string[]
        status?: OrderStatus[]
      },
      table?: '1'
      finished_table?: string
    }

    orderBy?: {
      key: keyof IOrderController;
      order: "asc" | "desc";
    };

    date?: {
      gte: Date;
      lte: Date;
    };
    pagination?: IQueryPagination;
  };
}
export interface IGetAllClientsResponse {
  data: IClient[];
  pagination: IPaginationResponse
}

export interface IGETClientQuery {
  byId?: {
    id: string;
    include?: {
      bookings?: "1";
    }
  };
  byEmail?: {
    email: string;
    include?: {
      bookings?: "1";
    }
  };
  all?: {
    email?: string;
    name?: string;
    contact_number?: string;

    blocked?: boolean;

    complaints?: number;
    restaurant_review?: number;
    staff_review?: number;

    include?: {
      bookings?: "1";
    }

    orderBy?: {
      key: keyof IClient
      order: "asc" | "desc";
    };
    pagination: IQueryPagination;
  };
}

export interface IGETSectionResponse {
  data: ISection[]
  pagination: IPaginationResponse
}


interface IGETSectionQuery {
  all?: {
    include?: {
      tables?: {
        guests: number[]
      }
      days_open?: '1'
      special_days?: '1'
    }
    pagination: IQueryPagination
    orderBy?: {
      key: keyof ISection
      order: 'asc' | 'desc';
    };
  };
}

export type IGETMenuOrderSystemResponse = {
  id: string
  title: string
  short_title: string
  to_order: boolean
  f_options: { id: string }[]
  go_with_ids: string[]
  mn_type: IMenuType
  mn_type_id: string
  options_priority: number
  to_print_ids: string[]
  value: number
  add_ons: IMenuAddOns[]
  allergens: string[]
}

export type IGETMenuResponse = {
  data: IMenu[];
  pagination: IPaginationResponse
};

export interface IGETMenuQuery {
  byId?: {
    id: string;
  };
  all?: {
    title?: string;

    website?: boolean;
    to_order?: boolean;
    mn_type_id?: string
    section_id?: string
    pagination?: IQueryPagination;

    in?: {
      mn_type_id?: string[]
      id?: string[]
      allergens?: string[]
      to_print_ids?: string[]
    }

    includes?: {
      add_ons?: '1',
      f_options?: '1',
      mn_type?: '1',
    }

    essential_only?: '1'

    orderBy?: {
      key: keyof IMenu;
      order: "asc" | "desc";
    };
  };
  order_system?: '1'
  highlight?: '1'
}

export interface IFinishedTableAllResponse {
  data: IFinishedTable[];
  pagination: IPaginationResponse
}

export interface IGETFinishedTableQuery {
  byId?: {
    id: string;
    table_id?: string;
    include?: {
      orders_controller?: {
        orders: {
          status: string[];
        } | '1'
      } | '1'
    };
  };
  all?: {
    date: {
      gte: Date;
      lte: Date;
    };
    guests?: string;
    client_name?: string;
    client_id?: string;
    table_id?: string;
    include?: {
      finished_orders?: "1";
    };
    orderBy?: {
      key: keyof IFinishedTable;
      order: "asc" | "desc";
    };
    pagination: IQueryPagination
  };
}

export interface IGETAllReviewsResponse {
  data: IReviews[];
  pagination: IPaginationResponse
}

export interface IGETReviewsQuery {
  all?: {
    client_id?: string;
    client?: {
      id?: string;
      name?: string;
      contact_number?: string;
      email?: string;
    };
    type?: IReviewsType
    key?: string;
    orderBy?: {
      key: keyof IReviews;
      order: "asc" | "desc";
    };
    include?: {
      client: '1'
    }
    pagination: IQueryPagination;
  };
}

export interface IGiftCardReponse {
  data: IGiftCards[];
  pagination: IPaginationResponse;
};

export interface IGETGiftCardQuery {
  byId?: {
    id: string;
    code?: string;
  };

  byCode?: {
    code: string;
  };

  all?: {
    name?: string;
    name_to?: string;
    value?: string;
    contact_number?: string;
    status?: IGiftCardStatus;
    payed?: "1";
    code?: string;

    date?: {
      gte: Date;
      lte: Date;
    };

    pagination: IQueryPagination;
    orderBy?: {
      key: keyof IGiftCards;
      order: "asc" | "desc";
    };
  };
}

export interface IAllAuthorizedDevicesResponse {
  data: IAuthorizedDevices[];
  pagination: IPaginationResponse
};


export interface IGETAuthorizedQuery {
  all?: {
    orderBy?: {
      key: keyof IAuthorizedDevices
      order: "asc" | "desc";
    };
    pagination?: IQueryPagination
  };
}

export interface IAllSpecialDaysResponse {
  data: ISpecialDays[];
  pagination: IPaginationResponse
};

export interface IGETSpecialDaysQuery {
  all?: {
    date?: {
      gte: Date;
      lte: Date;
    }
    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof ISpecialDays
      order: "asc" | "desc";
    };
  };
  byId?: {
    id: string;
  }
  byDate?: {
    date: Date;
  }
}

export interface IOpenDaysGetAllResponse {
  data: IBookingDays[];
  pagination: IPaginationResponse;
}

export interface IBookingPageBookings {
  id: string
  date: Date
  weekDay: string
  amount_of_people: number
  request?: string
  status: string
  has_request: boolean
  time: string
  client: {
    id: string
    name: string
    contact_number: string
    email: string
    qnt_of_bookings?: number
    restaurant_review?: number
  }
}

export interface GetBookingsWithNoTablesReturn {
  id: string
  date: Date
  weekDay: string
  amount_of_people: number
  request?: string
  status: IBookingStatus
  has_request: boolean
  time: string
  client: {
    id: string
    name: string
    contact_number: string
    email: string
    qnt_of_bookings?: number
    restaurant_review?: number
  }
}

export interface IGETSpareTablesReturn {
  id: string
  number: number
  is_open: boolean
  guests: number
  section: {
    id: string
    title: string
  }
}

export interface IGETBookingsPageReturn {
  id: string
  date: Date
  weekDay: string
  amount_of_people: number
  request?: string
  status: IBookingStatus
  has_request: boolean
  time: string
  table_id: string
  client: {
    id: string
    name: string
    contact_number: string
    email: string
    qnt_of_bookings?: number
    restaurant_review?: number
  },
  table: {
    id: string
    number: number
    meal_status: string
    is_open: boolean
    section: {
      id: string
      title: string
    }
  }
}

export interface IGETBookingPageTimesOpenReturn {
  id: string
  time: string
  active: boolean
  open: string
  close: string

  tables_available: {
    count: {
      2: number
      4: number
      6: number
      8: number
    },
    spare: IGETSpareTablesReturn[]
  }

  bookings: {
    bookings: IGETBookingsPageReturn[]
    canceled_not_shown: IBookings[]
    with_no_tables: IBookings[]
  }
}
export interface IBookingPageResponse {
  id: string
  date: Date;
  short_day: string;
  waiting_list: GetBookingsWithNoTablesReturn[]
  times_open: IGETBookingPageTimesOpenReturn[]
  sections_open: {
    id: string,
    title: string
  }[]
}

export interface IGETOpenDaysQuery {
  byId?: {
    id: string
  }
  byShortDay?: {
    short_day: string;
    date: Date;
  };
  all?: {
    pagination?: IQueryPagination
    orderBy?: {
      key: keyof IBookingDays
      order: "asc" | "desc";
    };
  };
  bookingPage?: {
    date: Date
    short_day: string,
    client?: {
      name?: string,
      contact_number?: string,
    },
    status?: {
      in: IBookingStatus[]
    },
    orderBy?: {
      key: keyof IBookings
      order: "asc" | "desc";
    }
  }
}

export interface IGETPrintersResponse {
  data: IPrinters[];
  pagination: IPaginationResponse
}

export interface IGETPrintersQuery {
  all?: {
    pagination: IQueryPagination;
    orderBy?: {
      key: keyof IPrinters;
      order: "asc" | "desc";
    };
  };
}

export interface IGETMenuSectionsResponse {
  data: IMenuSection[];
  pagination: IPaginationResponse
}

export interface IGETMenuSectionsQuery {
  all?: {
    pagination?: IQueryPagination;
    includes?: {
      types: '1'
    }
    orderBy?: {
      key: keyof IMenuSection
      order: "asc" | "desc";
    };
  };
}
export interface IGETMenuTypesResponse {
  data: IMenuType[];
  pagination: IPaginationResponse
}

export interface IGETMenuTypesQuery {
  all?: {
    title?: string
    section_id?: string
    pagination?: IQueryPagination;
    includes?: {
      menu?: '1'
      section?: '1'
    }
    orderBy?: {
      key: keyof IMenuType;
      order: "asc" | "desc";
    };
  };
}

export interface IGETMenuAddOnsResponse {
  data: IMenuAddOns[];
  pagination: IPaginationResponse
}


export interface IGETMenuAddOnsQuery {
  all?: {
    title?: string
    includes?: {
      menu?: '1'
    }
    in?: {
      id?: string[]
    }
    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof IMenuAddOns;
      order: "asc" | "desc";
    };
  };
}

export interface ITimesOpenWebsiteConfigResponse {
  id: string;
  title: string;
  real_time: string;
  show_time: string;
  disabled: boolean;
}

export interface IGETTimesOpenBody {
  all?: {
    base: '1'
  }
  websiteConfig?: {
    date: Date
    amount_per_table: number
  }
}


export type IGETRestaurantResponse = IGETAllBookingsResponse | IBookings | IGETTablesAllResponse | ITable | IAllOrdersResponse | IOrder | IAllOrderControllerResponse | IOrderController | IGetAllClientsResponse | IClient | IGETSectionResponse | ISection | IGETMenuResponse | IMenu | IFinishedTableAllResponse | IFinishedTable | IGETAllReviewsResponse | IReviews | IGiftCardReponse | IGiftCards | IGETAuthorizedQuery | IAllSpecialDaysResponse | ISpecialDays | IOpenDaysGetAllResponse | IBookingDays | IGETPrintersResponse | IGETMenuSectionsResponse | IGETMenuTypesResponse | IGETMenuAddOnsResponse | IGETMenuOrderSystemResponse[] | ITimesOpenWebsiteConfigResponse | IBookingPageResponse | ITimesOpen[]

export type IRestaurantDataQueryType = 'BOOKINGS' | 'TABLES' | "ORDER" | "ORDER_CONTROLLER" | 'CLIENTS' | "SECTIONS" | "MENU" | "FINISHED_TABLE" | "REVIEWS" | "GIFTCARD" | "AUTHORIZED_DEVICES" | 'SPECIAL_DAYS' | 'OPEN_DAYS' | 'PRINTERS' | 'MENU_SECTION' | 'MENU_TYPE' | 'MENU_ADD_ONS' | 'TIMES_OPEN'

export interface IGETRestaurantDataQuery {
  bookings?: IGETBookingsQuery
  tables?: IGETTablesQuery
  order?: IGETOrdersQuery
  orderController?: IGETOrderControllerQuery
  clients?: IGETClientQuery
  sections?: IGETSectionQuery
  menu?: IGETMenuQuery
  finishedTables?: IGETFinishedTableQuery
  reviews?: IGETReviewsQuery
  giftcards?: IGETGiftCardQuery
  authorizedDevices?: IGETAuthorizedQuery
  specialDays?: IGETSpecialDaysQuery
  openDays?: IGETOpenDaysQuery
  printers?: IGETPrintersQuery
  menu_sections?: IGETMenuSectionsQuery
  menu_types?: IGETMenuTypesQuery
  menu_add_ons?: IGETMenuAddOnsQuery
  times_open?: IGETTimesOpenBody
}

