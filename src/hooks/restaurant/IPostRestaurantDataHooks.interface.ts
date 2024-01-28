import { IBookingStatus, IBookings } from "@/common/types/restaurant/bookings.interface";
import { IMenu, IMenuAddOns, IMenuSection, IMenuType } from "@/common/types/restaurant/menu.interface";
import { IOrder, IOrderController, IOrderStatus } from "@/common/types/restaurant/order.interface";
import { IPUTTablesBody } from "./IPutRestaurantDataHooks.interface";
import { IGiftCardStatus, IGiftCards } from "@/common/types/restaurant/giftcard.interface";
import { IPOSTTransactionsBody } from "../company/IPostCompanyDataHooks.interface";
import { ISpecialDays, ITimesOpen } from "@/common/types/restaurant/config.interface";
import { ISection, ITable } from "@/common/types/restaurant/tables.interface";
import { IAuthorizedDevices } from "@/common/types/restaurant/authorizedDevices.interface";
import { IPrinters } from "@/common/types/restaurant/printers.interface";

export interface IPOSTBookingsBody {
  status: IBookingStatus
  amount_of_people: number;
  contact_number: string;
  valid_number: boolean;
  date: Date;
  email: string;
  name: string;
  time: string;
  request?: string;
}

export interface IPOSTTablesBody {
  section_id: string;
  number: number;
  guests: number;
}

export interface IPOSTOrderControllerBody {
  waiter: string;
  waiter_id: string;

  client_id: string;

  table_id: string;
}


export interface ICreateOrder {
  status: IOrderStatus
  quantity: number;

  // type: IType
  // menu_type: IMenuType

  price: number;
  description: string;

  menu: string;
  menu_id: string;
}


export interface IPOSTOrderBody {
  order?: {
    status: IOrderStatus;
    quantity: number;

    // type: IType;
    // menu_type: IMenuType;

    price: number;
    description: string;

    menu: string;
    menu_id: string;

    order_controller_id: string;
  };
  many?: {
    order_controller: IPOSTOrderControllerBody
    update_table: IPUTTablesBody
    orders: ICreateOrder[]
    to_print?: {
      ip: 'All' | string
    }
  };
}

export interface IPOSTSectionBody {
  title: string;
}

export interface IPOSTGiftCardBody {
  value: number;
  email?: string;
  name?: string;
  last_name?: string;
  contact_number?: string;
  message?: string;
  name_to?: string;
  address_to?: string;
  address_2_to?: string;
  city_to?: string;
  country_to?: string;
  eircode_to?: string;
  client_key?: string;
  code?: string;
  sent_by?: string
  sent_date?: Date;
  stripe_secret?: string;
  status?: IGiftCardStatus
  token?: string;
  transaction?: IPOSTTransactionsBody
}

export interface IPOSTAuthorizedDevicesBody {
  ip: string;
  description?: string;
}

export interface IPOSTSpecialDaysBody {
  date: string;
  is_disabled: boolean;
  times_open: ITimesOpen[];
}

export interface IPOSTTimesOpenBody {
  day_id: string;
  open: string;
  close: string;
  real_time: string;
  tables_available: any;
  title: string;
}

export interface IPOSTPrinterBody {
  title: string;
  description?: string;
  ip: string;
}


export interface IPOSTMenuSectionsBody {
  title: string;
  bg_color: string;
}

export interface IPOSTMenuTypesBody {
  title: string;
  section_id: string
}

export interface IPOSTMenuAddOnsBody {
  title: string
  flag?: string
  is_mandatory: boolean
  options: {
    title: string
    value: number
  }[]
  menu_ids: string[]
  multiple: boolean
  min: number
  max: number
}

export interface IPOSTMenuAddOnsOptionsBody {
  add_ons_id: string
  title: string
  value: string
}

export interface IPOSTMenuBody {
  title: string
  short_title: string
  description?: string
  thumbnail?: string
  value: number
  profit: number
  images?: string[]
  mn_type_id: string
  to_print_ids: string[]
  website: boolean
  to_order: boolean
  add_ons: string[]
  allergens: string[]
  go_with_ids: string[]
  f_options: string[]
  options_priority: number
}

export type IPOSTRestaurantDataQueryType = 'BOOKINGS' | 'TABLES' | "ORDER" | "ORDER_CONTROLLER" | 'SECTIONS' | "MENU" | "GIFTCARD" | "AUTHORIZED_DEVICES" | 'SPECIAL_DAYS' | 'TIMES_OPEN' | "PRINTERS" | 'MENU_SECTION' |
  'MENU_TYPE' | "MENU_ADD_ONS" | 'MENU_ADD_ONS_OPTIONS'

export type IPOSTRestaurantDataRerturn = IBookings | ITable | IOrder | IOrderController | ISection | IMenu | IGiftCards | IAuthorizedDevices | ISpecialDays | ITimesOpen | IPrinters | IMenuSection | IMenuType | IMenuAddOns

export interface IPOSTRestaurantBody {
  booking?: IPOSTBookingsBody
  table?: IPOSTTablesBody
  order?: IPOSTOrderBody
  section?: IPOSTSectionBody
  giftcard?: IPOSTGiftCardBody
  authorizedDevice?: IPOSTAuthorizedDevicesBody
  specialDays?: IPOSTSpecialDaysBody
  timesOpen?: IPOSTTimesOpenBody
  printer?: IPOSTPrinterBody
  
  menu?: IPOSTMenuBody
  menu_type?: IPOSTMenuTypesBody
  menu_add_ons?: IPOSTMenuAddOnsBody
  menu_section?: IPOSTMenuSectionsBody
  menu_add_ons_options?: IPOSTMenuAddOnsOptionsBody
}
