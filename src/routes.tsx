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

//algumas rotas como bookings serão pegadas do back-end
// e verificadas se o usuario tem permissao / device authorization 
// caso ele tenha permissao e esteja no device da rota o fetch será feito

const routers: IRoute[] = [
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
    // icon: <Wrench />,
    layout: "/admin/texas/waiters",
    authorization: [Permissions.ADMIN, Permissions.ADMIN_GHOST, Permissions.MENU],
    collapse: false,
    auth_device: true,
  },
  // {
  //   name: "Pass",
  //   path: "",
  //   icon: <Icon name='AArrowDown' size={14} />,
  //   // icon: <Wrench />,
  //   layout: "/admin/texas/waiters",
  //   authorization: ["my_profile"],
  //   collapse: false,
  // },
  // {
  //   name: "HACCP",
  //   path: "",
  //   icon: <Icon name='AArrowDown' size={14} />,
  //   // icon: <Wrench />,
  //   layout: "/admin/texas/waiters",
  //   authorization: ["my_profile"],
  //   collapse: false,
  // },
  // {
  //   path: "/live",
  //   name: "Restaurant Live",
  //   icon: <Icon name='AArrowDown' size={14} />,
  //   // icon: <ForkKnife />,
  //   layout: "/admin",
  //   authorization: ["admin", 'admin-ghost'],
  // },
  // {
  //   path: "/analytic",
  //   name: "Analytic",
  //   layout: "/admin",
  //   icon: <Icon name='AArrowDown' size={14} />,
  //   // icon: <ChartBar />,
  //   collapse: false,
  //   authorization: ["admin", 'admin-ghost'],
  // },
  {
    path: "/admin/restaurant",
    name: "Restaurant",
    layout: "/admin",
    icon: <Icon name='ChefHat' size={14} />,
    collapse: true,
    auth_device: true,
    // authorization: ["admin", 'admin-ghost', "booking_reader", "menu"],
    authorization: [
      Permissions.ADMIN,
      Permissions.ADMIN_GHOST,
      Permissions.MENU,
      Permissions.BOOKING_ADM
    ],
    //need [menu-list, menu-create]
    items: [
      // {
      //   name: "Analytics",
      //   path: "/analytics",
      //   icon: <Icon name='AArrowDown' size={14} />,
      //   layout: "/admin/restaurant",
      //   authorization: ["admin", 'admin-ghost'],
      // },
      // {
      //   name: "Bookings",
      //   path: "/bookings",
      //   icon: <Icon name='AArrowDown' size={14} />,
      //   layout: "/admin/restaurant",
      //   authorization: ["admin", 'admin-ghost', "booking_reader"],
      // },
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
        icon: <Icon name='AArrowDown' size={14} />,
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
        //need [menu-list, menu-create]
        items: [
          {
            name: "All",
            path: "/all",
            icon: <Icon name='Utensils' size={14} />,
            layout: "/admin/restaurant/menu",
            // authorization: ["admin", 'admin-ghost', 'menu'],
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
              Permissions.MENU
            ],
            auth_device: true,
            //routes [GET-MENU, GET-MENU-SECTION]
            //need [menu-list]
          },
          {
            name: "Create",
            path: "/create/section",
            icon: <Icon name='UtensilsCrossed' size={14} />,
            layout: "/admin/restaurant/menu",
            // authorization: ["admin", 'admin-ghost', 'menu', 'menu-create'],
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
              Permissions.MENU,
              Permissions.MENU_CREATE
            ],
            auth_device: true,
            //routes [GET-MENU, GET-PRINTERS GET-MENU_ADD_ONS, POST-MENU_ADD_ONS, PUT-MENU_ADD_ONS, DELETE-MENU_ADD_ONS, GET-MENU_SECTION, GET-MENU_TYPES, POST-MENU_SECTION, DELETE-MENU_SECTION, POST-MENU_TYPE, DELETE-MENU_TYPE]
            //meed [menu-create]
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
    // authorization: ["admin", 'admin-ghost', 'haccp_admin'],
    authorization: [
      Permissions.ADMIN,
      Permissions.ADMIN_GHOST,
      Permissions.HACCP_ADMIN
    ],
    auth_device: true,
    //need [user-list, user-list-filled, haccp-list, haccp-create, form-data-list]
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
            //rotas [GET-USER, GET-DEPARTAMENTS]
            //need [user-list]
          },
          // {
          //   name: "Performance",
          //   path: "/performance",
          //   icon: <Icon name='AArrowDown' size={14} />,
          //   layout: "/admin/hrsystem/employees",
          //   authorization: ["admin", 'admin-ghost'],
          // },
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
        // authorization: ["admin", 'admin-ghost', 'haccp_admin'],
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
          Permissions.HACCP_ADMIN
        ],
        auth_device: true,
        //need [form-data-list]
        items: [
          {
            name: "Data",
            path: "/data",
            icon: <Icon name='FileText' size={14} />,
            layout: "/admin/hrsystem/forms",
            // authorization: ["admin", 'admin-ghost', 'haccp_admin'],
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
              Permissions.HACCP_ADMIN
            ],
            auth_device : true,
            //rotas [GET-FORM-DATA, GET-FORMS]
            //need [form-data-list]
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
            auth_device: true,
          },
          {
            name: "Forms",
            path: "/forms",
            icon: <Icon name='FileText' size={14} />,
            layout: "/admin/hrsystem/forms",
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
              Permissions.HACCP_ADMIN
            ],
            auth_device: true
          },
        ],
      },
      {
        name: "Reports",
        path: "/reports",
        icon: <Icon name='Siren' size={14} />,
        layout: "/admin/hrsystem",
        collapse: true,
        // authorization: ["admin", 'admin-ghost', 'haccp_admin'],
        authorization: [
          Permissions.ADMIN,
          Permissions.ADMIN_GHOST,
          Permissions.HACCP_ADMIN
        ],
        
        //need [haccp-list, haccp-create]
        auth_device: true,
        items: [
          {
            name: "All",
            path: "/all",
            icon: <Icon name='FileSearch' size={14} />,
            layout: "/admin/hrsystem/reports",
            // authorization: ["admin", 'admin-ghost', 'haccp_admin'],
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
              Permissions.HACCP_ADMIN
            ],
            auth_device: true,
            //rotas [GET-HACCP-REPORTS, DELETE-HACCP-REPORTS]
            //need [haccp-list, haccp-delete]
          },
          {
            name: "Create",
            path: "/create",
            icon: <Icon name='FilePlus' size={14} />,
            layout: "/admin/hrsystem/reports",
            // authorization: ["admin", 'admin-ghost', 'haccp_admin'],
            authorization: [
              Permissions.ADMIN,
              Permissions.ADMIN_GHOST,
              Permissions.HACCP_ADMIN
            ],
            auth_device: true,
            //rotas [GET-FORMS, GET-FORMS_SECTION, POST-HACCP_REPORTS]
            //need [haccp-create]
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
    name: "Clock in",
    path: "/clockin",
    icon: <Icon name='Clock10' size={14} />,
    layout: "/admin",
    authorization: [
      Permissions.ADMIN,
      Permissions.ADMIN_GHOST,
      Permissions.MY_PROFILE
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
    // authorization: ["my_profile"],
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
