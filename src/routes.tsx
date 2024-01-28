import Icon from "./common/libs/lucida-icon";

export type IPermissions =
  | "my_profile"
  | "admin"
  | "admin-ghost"
  | "reception"
  | "booking_reader"
  | 'booking_pagination'
  | "booking_adm"
  | "tables"
  | "pass"
  | "orders"
  | "haccp_admin"
  | "waiters"
  | 'day_roster'


export interface IRoute {
  path: string;
  name: string;
  layout: string;
  icon: JSX.Element;
  collapse?: boolean;
  items?: IRoute[];

  authorization?: IPermissions[];
}


const routers: IRoute[] = [
  {
    name: "Bookings",
    path: "",
    icon: <Icon name='CalendarDays' size={14} />,
    layout: "/admin/texas/bookings",
    authorization: ["my_profile"],
    collapse: false,
  },
  {
    name: "Reception",
    path: "",
    icon: <Icon name='AArrowDown' size={14} />,
    // icon: <Wrench />,
    layout: "/admin/texas/reception",
    authorization: ["my_profile"],
    collapse: false,
  },
  {
    name: "Waiters",
    path: "",
    icon: <Icon name='AArrowDown' size={14} />,
    // icon: <Wrench />,
    layout: "/admin/texas/waiters",
    authorization: ["my_profile"],
    collapse: false,
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
  //   name: "Go Back",
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
    icon: <Icon name='AArrowDown' size={14} />,
    collapse: true,
    authorization: ["admin", 'admin-ghost', "booking_reader"],
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
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/restaurant",
        authorization: ["admin", 'admin-ghost'],
      },
      {
        name: "Clients",
        path: "/clients",
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/restaurant",
        authorization: ["admin", 'admin-ghost'],
      },
      {
        name: "Giftcard",
        path: "/giftcard",
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/restaurant",
        authorization: ["admin", 'admin-ghost'],
      },

      {
        name: "Menu",
        path: "/menu",
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/restaurant",
        collapse: true,
        authorization: ["admin", 'admin-ghost'],
        items: [
          {
            name: "All",
            path: "/all",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/restaurant/menu",
            authorization: ["admin", 'admin-ghost'],
          },
          {
            name: "Create",
            path: "/create/section",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/restaurant/menu",
            authorization: ["admin", 'admin-ghost'],
          },
        ],
      },
      // {
      //   name: "Settings",
      //   path: "/settings",
      //   icon: <Icon name='AArrowDown' size={14} />,
      //   layout: "/admin/restaurant",
      //   authorization: ["admin", 'admin-ghost'],
      // },
    ],
  },
  {
    path: "/admin/hrsystem",
    name: "HR System",
    icon: <Icon name='AArrowDown' size={14} />,
    layout: "/admin",
    collapse: true,
    authorization: ["admin", 'admin-ghost', 'haccp_admin'],
    items: [
      {
        name: "Employees",
        path: "/employees",
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/hrsystem",
        collapse: true,
        authorization: ["admin", 'admin-ghost'],
        items: [
          {
            name: "Employees",
            path: "/all",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/hrsystem/employees",
            authorization: ["admin", 'admin-ghost'],
          },
          {
            name: "Performance",
            path: "/performance",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/hrsystem/employees",
            authorization: ["admin", 'admin-ghost'],
          },
          {
            name: "New Hire",
            path: "/hire",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/hrsystem/employees",
            authorization: ["admin", 'admin-ghost'],
          },
          {
            name: "Filed",
            path: "/filled",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/hrsystem/employees",
            authorization: ["admin", 'admin-ghost'],
          },
        ],
      },
      {
        name: "Roster",
        path: "/roster",
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/hrsystem",
        authorization: ["admin", 'admin-ghost'],
      },
      {
        name: "Tasks",
        path: "/tasks",
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/hrsystem",
        collapse: true,
        authorization: ["admin", 'admin-ghost'],
        items: [
          {
            name: "All",
            path: "/all",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/hrsystem/tasks",
            authorization: ["admin", 'admin-ghost'],
          },
          {
            name: "Create",
            path: "/create",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/hrsystem/tasks",
            authorization: ["admin", 'admin-ghost'],
          },
        ],
      },
      {
        name: "Forms",
        path: "/forms",
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/hrsystem",
        collapse: true,
        authorization: ["admin", 'admin-ghost', 'haccp_admin'],
        items: [
          {
            name: "Data",
            path: "/data",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/hrsystem/forms",
            authorization: ["admin", 'admin-ghost', 'haccp_admin'],
          },
          {
            name: "Create",
            path: "/create",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/hrsystem/forms",
            authorization: ["admin", 'admin-ghost', 'haccp_admin'],
          },
          {
            name: "Config",
            path: "/config",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/hrsystem/forms",
            authorization: ["admin", 'admin-ghost', 'haccp_admin'],
          },
        ],
      },
      {
        name: "Reports",
        path: "/reports",
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/hrsystem",
        collapse: true,
        authorization: ["admin", 'admin-ghost', 'haccp_admin'],
        items: [
          {
            name: "All",
            path: "/all",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/hrsystem/reports",
            authorization: ["admin", 'admin-ghost', 'haccp_admin'],
          },
          {
            name: "Create",
            path: "/create",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/hrsystem/reports",
            authorization: ["admin", 'admin-ghost', 'haccp_admin'],
          },

        ],
      },
      {
        name: "Payments",
        path: "/payments",
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/hrsystem",
        collapse: true,
        authorization: ["admin", 'admin-ghost'],
        items: [
          {
            name: "All",
            path: "/all",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/hrsystem/payments",
            authorization: ["admin", 'admin-ghost'],
          },
          {
            name: "Roster",
            path: "/roster",
            icon: <Icon name='AArrowDown' size={14} />,
            layout: "/admin/hrsystem/payments",
            authorization: ["admin", 'admin-ghost'],
          },
        ],
      },

      {
        name: "Requests",
        path: "/requests",
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/hrsystem",
        authorization: ["admin", 'admin-ghost'],
      },
      {
        name: "Settings",
        path: "/settings",
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/hrsystem",
        authorization: ["admin", 'admin-ghost'],
      },
    ],
  },
  {
    path: "/admin/apps",
    name: "Apps",
    layout: "/admin",
    icon: <Icon name='AArrowDown' size={14} />,
    collapse: true,
    authorization: ["admin", 'admin-ghost', 'day_roster'],
    items: [
      {
        name: "Day Roster",
        path: "/dayroster",
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/apps",
        authorization: ["admin", 'admin-ghost', 'day_roster'],
      },
      {
        name: "Clock in",
        path: "/clockin",
        icon: <Icon name='AArrowDown' size={14} />,
        layout: "/admin/apps",
        authorization: ["admin"],
      },
    ],
  },
  // {
  //   path: "/forms",
  //   name: "HACCP",
  //   layout: "/admin",
  //   icon: <Icon name='AArrowDown' size={14} />,
  //   // icon: <ClipboardText />,
  //   collapse: false,
  //   authorization: ["my_profile"],
  // },
  {
    name: "My Roster",
    path: "",
    icon: <Icon name='AArrowDown' size={14} />,
    layout: "/admin/roster",
    authorization: ["my_profile"],
    collapse: false,
  },
  {
    name: "Requests",
    path: "",
    icon: <Icon name='AArrowDown' size={14} />,
    layout: "/admin/requests",
    authorization: ["my_profile"],
    collapse: false,
  },
  {
    name: "Company",
    path: "",
    icon: <Icon name='AArrowDown' size={14} />,
    layout: "/admin/company",
    authorization: ["my_profile"],
    collapse: false,
  },
  {
    name: "My Info",
    path: "",
    icon: <Icon name='AArrowDown' size={14} />,
    layout: "/admin/myinfo",
    authorization: ["my_profile"],
    collapse: false,
  },
];

export default routers;
