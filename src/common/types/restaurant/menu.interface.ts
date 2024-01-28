export enum Allergens {
  GLUTEN = 'Gluten',
  CRUSTACEANS = 'Crustaceans',
  EGGS = 'Eggs',
  FISH = 'Fish',
  PEANUTS = 'Peanuts',
  SOY = 'Soy',
  MILK = 'Milk',
  NUTS = 'Nuts',
  CELERY = 'Celery',
  MUSTARD = 'Mustard',
  SESAME = 'Sesame',
  SULPHITES = 'Sulphites',
  LUPIN = 'Lupin',
  MOLLUSCS = 'Molluscs',
  NONE = 'None'
}

export enum OptionsPriority {
  LOW = '1',
  MEDIUM = '2',
  HIGH = '3',
}

export interface IMenuSection {
  id: string
  title: string
  types: IMenuType[]
  bg_color: string

  created_at: Date
  updated_at: Date
}

export interface IMenuType {
  id: string

  title: string
  menu: IMenu[]

  section: IMenuSection
  section_id: string

  created_at: Date
  updated_at: Date
}

export interface IMenu {
  id: string;

  thumbnail_id?: string //todo: REMOVE IT
  price: number; //todo: REMOVE IT
  allergies: string[] //todo: REMOVE IT
  video?: string //todo: REMOVE IT
  sides: string[] //todo: REMOVE IT
  extras: string[] //todo: REMOVE IT
  type?: string //todo: REMOVE IT
  images: {
    id: string;
    url: string;
    secure_url: string;
    public_id: string;
  }[];//todo: REMOVE IT
  menu_type: string //todo: REMOVE IT

  title: string; //website - recipt
  short_title: string; //apps - order
  description?: string;
  thumbnail?: string;
  thumbnail_file_id?: string; // na tabela files

  mn_type: IMenuType // menu type
  mn_type_id: string

  profit?: number // percentage
  value: number; //price in cents

  website: boolean // on website
  highlight: boolean // website
  to_order: boolean // app

  allergens: string[] //pode manter string pois serao opcoes defalut

  to_print_ids: string[] // id da impressora que vai imprimir o pedido
  go_with_ids: string[] // ids dos produtos que podem ser combinados com esse exemplo GIN + Tonic
  add_ons: IMenuAddOns[] // ids dos add_ons que podem ser adicionados a esse produto

  img_ids?: string[] // ids das imagens que serao exibidas no site

  f_options: IMenu[] // sao as opcoes do produto que aparece no segundo pop-up (f: fallowing)
  fby_options: IMenu[] // optcões que estao seguindo esse produto (fby: fallowed by)
  
  options_priority: number // ordem que vai aparecer no app

  // stock_items: IStockItem[] 
  created_at: Date
  updated_at: Date
}

export interface IMenuAddOns {
  id: string
  title: string // Cooked //Free Sides                                 
  flag?: string // on-side
  is_mandatory: boolean // true
  multiple: boolean // true
  max: number // 2 if is 999 is unlimited
  min: number // 0   

  options: IMenuAddOnsOption[] //[Rare, Medium Rare, Medium, Well Done]
  menu: IMenu[]

  created_at: Date
  updated_at: Date
}

export interface IMenuAddOnsOption {
  id: string
  title: string // Cooked                                        
  value: number // price in cents                              

  add_ons: IMenuAddOns
  add_ons_id: string

  created_at: Date
  updated_at: Date
}
