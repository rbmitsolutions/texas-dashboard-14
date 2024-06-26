import Icon from "./common/libs/lucida-icon";
import { Permissions } from "./common/types/auth/auth.interface";

export interface IRoute {
  path: string;
  name: string;
  layout: string;
  icon: JSX.Element;
  collapse?: boolean;
  items?: IRoute[];

  authorization: Permissions[];
  auth_device: boolean;
}

const routers: IRoute[] = [
  {
    path: "/analytics",
    name: "Analytic",
    layout: "/admin",
    icon: <Icon name='LineChart' size={14} />,
    collapse: false,
    authorization: [
      Permissions.ADMIN,
      Permissions.ADMIN_GHOST,
    ],
    auth_device: true
  },
  {
    name: "Bookings",
    path: "",
    icon: <Icon name='CalendarDays' size={14} />,
    layout: "/admin/texas/bookings",
    authorization: [
      Permissions.ADMIN,
      Permissions.ADMIN_GHOST,
      Permissions.BOOKING_ADM,
      Permissions.BOOKING_READER
    ],
    collapse: false,
    auth_device: true
  },
  {
    name: "Reception",
    path: "",
    icon: <Icon name='Computer' size={14} />,
    layout: "/admin/texas/reception",
    authorization: [
      Permissions.ADMIN,
      Permissions.ADMIN_GHOST,
      Permissions.RECEPTION,
    ],
    collapse: false,
    auth_device: true
  },
  {
    name: "Waiters",
    path: "",
    icon: <Icon name='CookingPot' size={14} />,
    layout: "/admin/texas/waiters",
    authorization: [Permissions.ADMIN, Permissions.ADMIN_GHOST, Permissions.WAITERS],
    collapse: false,
    auth_device: true,
  },
  {
    name: "Orders",
    path: "",
    icon: <Icon name='ChefHat' size={14} />,
    layout: "/admin/texas/orders/orders",
    authorization: [Permissions.ADMIN, Permissions.ADMIN_GHOST, Permissions.PASS],
    collapse: true,
    auth_device: true,
    items: [
      {
        name: "Chefs",
        path: "",
        icon: <Icon name='ChefHat' size={14} />,
        layout: "/admin/texas/orders/chefs",
        authorization: [Permissions.ADMIN, Permissions.ADMIN_GHOST, Permissions.ORDERS],
        collapse: false,
        auth_device: true,
      },
      {
        name: "Pass",
        path: "",
        icon: <Icon name='ChefHat' size={14} />,
        layout: "/admin/texas/orders/pass",
        authorization: [Permissions.ADMIN, Permissions.ADMIN_GHOST, Permissions.PASS],
        collapse: false,
        auth_device: true,
      },
    ]
  },
  {
    path: "/admin/restaurant",
    name: "Restaurant",
    layout: "/admin",
    icon: <Icon name='ChefHat' size={14} />,
    collapse: true,
    auth_device: true,
    authorization: [
      Permissions.ADMIN,
      Permissions.ADMIN_GHOST,
      Permissions.MENU,
      Permissions.BOOKING_ADM
    ],
    items: [
      {
        name: "Reviews",
        path: "/reviews",
        icon: <Icon name='Star' size={14} />,
        layout: "/admin/restaurant",
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
          Permissions.BOOKING_ADM
        ],
        auth_device: true,
      },
      {
        name: "Clients",
        path: "/clients",
        icon: <Icon name='UsersRound' size={14} />,
        layout: "/admin/restaurant",
        authorization: [
          Permissions.ADMIN,
          Permissions.BOOKING_ADM
        ],
        auth_device: true,
      },
      {
        name: "Giftcard",
        path: "/giftcard",
        icon: <Icon name='Gift' size={14} />,
        layout: "/admin/restaurant",
        authorization: [
          Permissions.ADMIN,
          Permissions.BOOKING_ADM
        ],
        auth_device: true,
      },
      {
        name: "Menu",
        path: "/menu",
        icon: <Icon name='CookingPot' size={14} />,
        layout: "/admin/restaurant",
        collapse: true,
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
          Permissions.MENU
        ],
        auth_device: true,
        items: [
          {
            name: "All",
            path: "/all",
            icon: <Icon name='Utensils' size={14} />,
            layout: "/admin/restaurant/menu",
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
              Permissions.MENU
            ],
            auth_device: true,
          },
          {
            name: "Create",
            path: "/create/section",
            icon: <Icon name='UtensilsCrossed' size={14} />,
            layout: "/admin/restaurant/menu",
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
              Permissions.MENU,
              Permissions.MENU_CREATE
            ],
            auth_device: true,
          },
        ],
      },
    ],
  },
  {
    path: "/admin/hrsystem",
    name: "HR System",
    icon: <Icon name='Building' size={14} />,
    layout: "/admin",
    collapse: true,
    authorization: [
      Permissions.ADMIN,
      Permissions.ADMIN_GHOST,
      Permissions.HACCP_ADMIN
    ],
    auth_device: true,
    items: [
      {
        name: "Employees",
        path: "/employees",
        icon: <Icon name='Users' size={14} />,
        layout: "/admin/hrsystem",
        collapse: true,
        auth_device: true,
        authorization: [Permissions.ADMIN, Permissions.ADMIN_GHOST],
        items: [
          {
            name: "Employees",
            path: "/all",
            icon: <Icon name='Users' size={14} />,
            layout: "/admin/hrsystem/employees",
            authorization: [Permissions.ADMIN, Permissions.ADMIN_GHOST],
            auth_device: true,
          },
          {
            name: "Hire",
            path: "/hire",
            icon: <Icon name='UserPlus' size={14} />,
            layout: "/admin/hrsystem/employees",
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
            ],
            auth_device: true,
          },
          {
            name: "Filed",
            path: "/filled",
            icon: <Icon name='UserRoundMinus' size={14} />,
            layout: "/admin/hrsystem/employees",
            // authorization: ["admin", 'admin-ghost'],
            authorization: [Permissions.ADMIN, Permissions.ADMIN_GHOST],
            auth_device: true,
            //rotas [GET-USER, GET-ROLES]
            //need [user-list-filled]
          },
        ],
      },
      {
        name: "Requests",
        path: "/requests",
        icon: <Icon name='Mails' size={14} />,
        layout: "/admin/hrsystem",
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
        ],
        auth_device: true,
      },
      {
        name: "Roster",
        path: "/roster",
        icon: <Icon name='Network' size={14} />,
        layout: "/admin/hrsystem",
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
        ],
        auth_device: true,
      },
      {
        name: "Forms",
        path: "/forms",
        icon: <Icon name='FileText' size={14} />,
        layout: "/admin/hrsystem",
        collapse: true,
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
          Permissions.HACCP_ADMIN
        ],
        auth_device: false,
        items: [
          {
            name: "Data",
            path: "/data",
            icon: <Icon name='FileText' size={14} />,
            layout: "/admin/hrsystem/forms",
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
              Permissions.HACCP_ADMIN
            ],
            auth_device: true,
          },
          {
            name: "Create",
            path: "/create",
            icon: <Icon name='FilePlus' size={14} />,
            layout: "/admin/hrsystem/forms",
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
              Permissions.HACCP_ADMIN
            ],
            auth_device: false,
          },
          {
            name: "Forms",
            path: "/all",
            icon: <Icon name='FileText' size={14} />,
            layout: "/admin/hrsystem/forms",
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
              Permissions.HACCP_ADMIN
            ],
            auth_device: false
          },
        ],
      },
      {
        name: "Reports",
        path: "/reports",
        icon: <Icon name='Siren' size={14} />,
        layout: "/admin/hrsystem",
        collapse: true,
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
          Permissions.HACCP_ADMIN
        ],
        auth_device: true,
        items: [
          {
            name: "All",
            path: "/all",
            icon: <Icon name='FileSearch' size={14} />,
            layout: "/admin/hrsystem/reports",
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
              Permissions.HACCP_ADMIN
            ],
            auth_device: true,
          },
          {
            name: "Create",
            path: "/create",
            icon: <Icon name='FilePlus' size={14} />,
            layout: "/admin/hrsystem/reports",
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
              Permissions.HACCP_ADMIN
            ],
            auth_device: true,
          },

        ],
      },
      {
        name: "Payments",
        path: "/payments/all",
        icon: <Icon name='Banknote' size={14} />,
        layout: "/admin/hrsystem",
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
        ],
        auth_device: true,
      }
    ],
  },
  {
    path: "/admin/stock",
    name: "Stock",
    icon: <Icon name='Blocks' size={14} />,
    layout: "/admin",
    collapse: true,
    authorization: [
      Permissions.ADMIN,
      Permissions.ADMIN_GHOST,
      Permissions.STOCK_MANAGER
    ],
    auth_device: true,
    items: [
      {
        name: "Stock",
        path: "/stock",
        icon: <Icon name='Building2' size={14} />,
        layout: "/admin/stock",
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
          Permissions.STOCK_MANAGER
        ],
        auth_device: true,
      },
      {
        name: "New Order",
        path: "/new-order",
        icon: <Icon name='Truck' size={14} />,
        layout: "/admin/stock",
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
          Permissions.STOCK_MANAGER
        ],
        auth_device: true,
      },
      {
        name: "Orders",
        path: "/orders",
        icon: <Icon name='PackageCheck' size={14} />,
        layout: "/admin/stock",
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
          Permissions.STOCK_MANAGER
        ],
        auth_device: true,
      },
      {
        name: "Suppliers",
        path: "/suppliers",
        icon: <Icon name='Building2' size={14} />,
        layout: "/admin/stock",
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
          Permissions.STOCK_MANAGER
        ],
        auth_device: true,
      },
      {
        name: "Config",
        path: "/config",
        icon: <Icon name='Settings' size={14} />,
        layout: "/admin/stock",
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
          Permissions.STOCK_MANAGER
        ],
        auth_device: true,
      },
    ]
  },
  {
    name: "Clock in",
    path: "/clockin",
    icon: <Icon name='Clock10' size={14} />,
    layout: "/admin",
    authorization: [
      Permissions.ADMIN,
      Permissions.ADMIN_GHOST,
    ],
    auth_device: true,
  },
  {
    name: "Day Roster",
    path: "/dayroster",
    icon: <Icon name='Network' size={14} />,
    layout: "/admin",
    authorization: [
      Permissions.ADMIN,
      Permissions.ADMIN_GHOST,
      Permissions.DAY_ROSTER
    ],
    auth_device: true,
  },
  {
    path: "/haccp",
    name: "HACCP",
    layout: "/admin",
    icon: <Icon name='FileText' size={14} />,
    // icon: <ClipboardText />,
    collapse: false,
    authorization: [
      Permissions.MY_PROFILE
    ],
    auth_device: true,
  },
  {
    name: "My Roster",
    path: "",
    icon: <Icon name='Network' size={14} />,
    layout: "/admin/roster",
    authorization: [Permissions.MY_PROFILE],
    auth_device: false,
    collapse: false,
  },
  {
    name: "Requests",
    path: "",
    icon: <Icon name='Mails' size={14} />,
    layout: "/admin/requests",
    authorization: [Permissions.MY_PROFILE],
    auth_device: false,
    collapse: false,
  },
  {
    name: "Company",
    path: "",
    icon: <Icon name='Building' size={14} />,
    layout: "/admin/company",
    authorization: [Permissions.MY_PROFILE],
    auth_device: false,
    collapse: false,
  },
  {
    name: "My Info",
    path: "",
    icon: <Icon name='User' size={14} />,
    layout: "/admin/myinfo",
    authorization: [Permissions.MY_PROFILE],
    auth_device: false,
    collapse: false,
  },
];

export default routers;
