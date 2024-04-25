export type IDELETERestaurantDataQueryType = 'BOOKINGS' | "TABLES" | "SECTIONS" | 'MENU' | 'GIFTCARD' | 'AUTHORIZED_DEVICES' | 'SPECIAL_DAYS' | 'TIMES_OPEN' | "PRINTERS" | 'MENU_SECTION' | 'MENU_TYPE' | 'MENU_ADD_ONS' | 'MENU_ADD_ONS_OPTIONS' | "FINISHED_TABLE" | 'MENU_TO_MAKE'
export interface IDELETERestaurantDataBody {
  booking?: {
    id: string;
  }
  table?: {
    id: string;
  }
  section?: {
    id: string
  }
  menu?: {
    id: string
  }
  giftcard?: {
    id: string
  }
  authorizedDevice?: {
    id: string
  }
  specialDay?: {
    id: string
  }
  timesOpen?: {
    id: string
  }
  printer?: {
    id: string
  }
  menu_section?: {
    id: string
  }
  menu_type?: {
    id: string
  },
  menu_add_ons?: {
    id: string
  },
  menu_add_ons_options?: {
    id: string
  }
  menu_to_make?: {
    id: string
  }
  finishedTable?: {
    id: string
  }
}