import { IBookings } from "@/common/types/restaurant/bookings.interface";
import { ITimesOpen } from "@/common/types/restaurant/config.interface";
import { IGiftCardStatus } from "@/common/types/restaurant/giftcard.interface";
import { IMenu } from "@/common/types/restaurant/menu.interface";
import { IOrderStatus } from "@/common/types/restaurant/order.interface";
import { ITableMealStatus } from "@/common/types/restaurant/tables.interface";

export interface IPUTTablesBody {
    id: string;
    data: {
        client_id?: string | null;
        client_name?: string | null;
        booking_id?: string | null;
        start_time?: Date | null;
        guests?: number;
        is_open?: boolean;
        section_id?: string;
        meal_status?: ITableMealStatus
        food_ordered_at?: Date;
    };
    close_table?: boolean;
    open_table?: boolean;
}

export interface IOrderControllerPut {
    id: string;

    waiter_id?: string;

    client_id?: string;

    table_id?: string | null;
    finished_table_id?: string | null;
}

export interface IPUTOrderControllerBody {
    orderController: {
        one?: IOrderControllerPut;
        many?: {
            id: {
                in: string[];
            };
            data: {
                waiter_id?: string;

                client_id?: string;

                table_id?: string | null;

                finished_table_id?: string;
            };
        };
    };
}


export type IOrderPut = {
    status?: IOrderStatus
    quantity?: number;

    // type?: IType
    // menu_type?: IMenuType

    price?: number;
    description?: string;

    menu?: string;
    menu_id?: string;

    order_controller_id?: string;
};

export interface IPUTOrderBody {
    order?: {
        id: string;
        data: IOrderPut;
        order_controller?: IPUTOrderControllerBody['orderController']
        check_for_more_orders?: {
            order_controller_id: string;
            check_for: string[];
            order_status: IOrderStatus;
            order_controller: IPUTOrderControllerBody['orderController']
        };
    };
    many?: {
        orders: {
            id: {
                in: string[];
            };
            data: IOrderPut;
        };
        order_controller?: IPUTOrderControllerBody['orderController']
        update_table?: IPUTTablesBody;
    };
}

export type IClientPut = {
    email?: string;
    name?: string;
    contact_number?: string;
    valid_number?: boolean;
    blocked?: boolean;
    qnt_of_bookings?: number;
    complaints?: number;
    restaurant_review?: number;
    staff_review?: number;
    last_booking?: Date;
};


export interface IPUTBookingsBody {
    data: {
        client?: {
            id: string;
        } & IClientPut;
        many?: {
            id: {
                in: string[];
            };
            data: IClientPut;
        };
    };
}

export interface IPUTSectionBody {
    id: string;
    title: string;
}

export interface IPUTGiftCardBody {
    one?: {
        id: string;
        status?: IGiftCardStatus
        code?: string;
        sent_by?: string;
        sent_date?: Date;
        payed?: boolean;
        spent?: number
    };
}

export interface IPUTAuthorizedDevicesBody {
    id: string;
    ip?: string;
    description?: string;
}

export interface IPUTSpecialDaysBody {
    id: string
    times_open?: ITimesOpen[]
}

export interface IPUTTimesOpenBody {
    id: string;
    tables_available: any;
    active: boolean;
    close_time?: {
        date: Date
    }
}

export interface IPUTPrinterBody {
    id: string;
    title?: string;
    description?: string;
    ip?: string;
}

export interface IPUTMenuSectionsBody {
    id: string;
    title: string;
    bg_color: string;
}

export interface IPUTMenuTypesBody {
    id: string;
    title?: string;
    section_id?: string
}

export interface IPUTMenuAddOnsBody {
    id: string;
    title?: string;
    flag?: string
    is_mandatory?: boolean
    options?: {
        remove_ids?: string[]
        add?: {
            title: string
            value: number
        }[]
    }
    menu_ids?: {
        remove_ids?: string[]
        add_ids?: string[]
    },
    multiple?: boolean
    min?: number
    max?: number
}

export interface IPUTMenuBody {
    menu: {
      id: string
      title?: string
      short_title?: string
      description?: string
      value?: number
      profit?: number
  
      mn_type_id?: string
      website?: boolean
      to_order?: boolean
      options_priority?: number
      to_print_ids?: string[]
      allergens?: string[]
  
      thumbnail?: string
      
      images?: {
        add: string[]
        remove: string[]
      }
      f_options?: {
        remove: string[]
        add: string[]
      }
      go_with_ids?: {
        remove: string[]
        add: string[]
      }
      add_ons?:{
        remove: string[]
        add: string[]
      }
    };
    highlight?: {
        id: string
    }
  }
  

export type IPUTRestaurantDataQueryType = 'BOOKINGS' | "TABLES" | "ORDER" | "CLIENTS" | "SECTIONS" | "MENU" | "GIFTCARD" | "AUTHORIZED_DEVICES" | 'SPECIAL_DAYS' | 'TIMES_OPEN' | "PRINTERS" | 'MENU_SECTION' | 'MENU_TYPE' | 'MENU_ADD_ONS'

export interface IPUTRestaurantBody {
    booking?: IBookings
    table?: IPUTTablesBody
    order?: IPUTOrderBody
    client?: IPUTBookingsBody
    section?: IPUTSectionBody
    menu?: IPUTMenuBody
    giftcard?: IPUTGiftCardBody
    authorizedDevice?: IPUTAuthorizedDevicesBody
    specialDays?: IPUTSpecialDaysBody
    timesOpen?: IPUTTimesOpenBody
    printer?: IPUTPrinterBody
    menu_section?: IPUTMenuSectionsBody
    menu_type?: IPUTMenuTypesBody
    menu_add_ons?: IPUTMenuAddOnsBody
}
