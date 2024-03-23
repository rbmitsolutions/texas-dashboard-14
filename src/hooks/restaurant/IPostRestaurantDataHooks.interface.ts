import { IBookingStatus, IBookings } from "@/common/types/restaurant/bookings.interface";
import { IMenu, IMenuAddOns, IMenuSection, IMenuType } from "@/common/types/restaurant/menu.interface";
import { IOrder, IOrderController, OrderStatus } from "@/common/types/restaurant/order.interface";
import { IPUTTablesBody } from "./IPutRestaurantDataHooks.interface";
import { IGiftCardStatus, IGiftCards } from "@/common/types/restaurant/giftcard.interface";
import { IPOSTTransactionsBody } from "../company/IPostCompanyDataHooks.interface";
import { ISpecialDays, ITimesOpen } from "@/common/types/restaurant/config.interface";
import { ISection, ITable } from "@/common/types/restaurant/tables.interface";
import { IAuthorizedDevices } from "@/common/types/restaurant/authorizedDevices.interface";
import { IPrinters } from "@/common/types/restaurant/printers.interface";
import { IAddOnsCreateOrder } from "@/store/restaurant/order";
import { TransactionsMethod, TransactionsType } from "@/common/types/company/transactions.interface";

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
  table_id?: string;
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
  status: OrderStatus;
  quantity: number

  mn_type: string
  mn_section: string

  price: number

  menu: string,
  menu_id: string
  menu_short_title: string

  add_ons: IAddOnsCreateOrder[]

  to_print_ips: string[]
}


export interface IPOSTOrderBody {
  order?: {
    status: OrderStatus;
    quantity: number

    mn_type: string
    mn_section: string

    price: number

    menu: string,
    menu_id: string
    menu_short_title: string

    add_ons: IAddOnsCreateOrder[]

    to_print_ips: string[]

    order_controller_id: string
    toPrint?: '1'
  };
  many?: {
    order_controller: IPOSTOrderControllerBody
    update_table: IPUTTablesBody
    orders: ICreateOrder[]
    toPrint?: '1'
  };
}

export interface IPOSTSectionBody {
  title: string;
  priority: number;
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
  transaction?: IPOSTTransactionsBody['one']
  print?: {
    ip?: string
  }
}

export interface IPOSTAuthorizedDevicesBody {
  description: string;
}

export interface IPOSTSpecialDaysBody {
  date: Date;
  is_disabled: boolean;
  times_open_ids: string[]
  section_ids: string[]
}

export interface IPOSTTimesOpenBody {
  open: string;
  close: string;
  real_time: string;
  title: string;
  base: boolean
  days_ids?: string[];
  special_days_ids?: string[];
}

export interface IPOSTPrinterBody {
  title: string;
  description?: string;
  ip: string;
}

export interface IPrintOrderController {
  orderControllerId: string
  tableId: string
}

export interface IPrintOrderTo {
  ip: string
  orderControllerId: string
  tableId: string
}

export interface IPrintBill {
  ip: string
  tableId: string
  transaction_method?: TransactionsMethod
}

export interface IFinishTableBill {
  ip: string
  finishedTableId: string
}

export interface IOpenTill {
  ip: string
}

export interface IPrintGiftCardBalance {
  ip: string
  giftCardId: string
}
export interface IPOSTToPrintBody {
  order?: IPrintOrderController
  to?: IPrintOrderTo
  bill?: IPrintBill
  openTill?: IOpenTill
  finishTableBill?: IFinishTableBill
  giftCardBalance?: IPrintGiftCardBalance
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
  'MENU_TYPE' | "MENU_ADD_ONS" | 'MENU_ADD_ONS_OPTIONS' | 'TO_PRINT'

export type IPOSTRestaurantDataRerturn = IBookings | ITable | IOrder | IOrderController | ISection | IMenu | IGiftCards | IAuthorizedDevices | ISpecialDays | ITimesOpen | IPrinters | IMenuSection | IMenuType | IMenuAddOns

export interface IPOSTRestaurantBody {
  booking?: IPOSTBookingsBody
  table?: IPOSTTablesBody
  order?: IPOSTOrderBody
  section?: IPOSTSectionBody
  giftcard?: IPOSTGiftCardBody
  authorizedDevice?: IPOSTAuthorizedDevicesBody
  specialDay?: IPOSTSpecialDaysBody
  timesOpen?: IPOSTTimesOpenBody
  printer?: IPOSTPrinterBody
  toPrint?: IPOSTToPrintBody

  menu?: IPOSTMenuBody
  menu_type?: IPOSTMenuTypesBody
  menu_add_ons?: IPOSTMenuAddOnsBody
  menu_section?: IPOSTMenuSectionsBody
  menu_add_ons_options?: IPOSTMenuAddOnsOptionsBody
}
