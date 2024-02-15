import { Permissions } from "@/common/types/auth/auth.interface";

export const rolesPermissions = [
    {
        title: 'Admin',
        permission_needed: [Permissions.ADMIN],
        permission: Permissions.ADMIN,
        description: 'Full access to the system'
    },
    {
        title: 'Admin Ghost',
        permission_needed: [Permissions.ADMIN_GHOST],
        permission: Permissions.ADMIN_GHOST,
        description: 'Can see all the data but can not create, edit or delete'
    },
    {
        title: 'Booking',
        permission_needed: [Permissions.BOOKING_READER],
        permission: Permissions.BOOKING_READER,
        description: '',
        aditional: [
            {
                title: 'Daily',
                permission_needed: [Permissions.BOOKING_READER],
                permission: Permissions.BOOKING_READER,
                description: 'Can see all the daily bookings without pagination'
            },
            {
                title: 'Pagination',
                permission_needed: [Permissions.BOOKING_PAGINATION, Permissions.BOOKING_READER],
                permission: Permissions.BOOKING_PAGINATION,
                description: 'Can see all the bookings and paginate'
            },
            {
                title: 'Booking Admin',
                permission_needed: [Permissions.BOOKING_ADM, Permissions.BOOKING_READER, Permissions.BOOKING_PAGINATION],
                permission: Permissions.BOOKING_ADM,
                description: 'Can delete bookings and also see clients details + close time on the website'
            }
        ]
    },
    {
        title: 'Reception',
        permission_needed: [Permissions.RECEPTION],
        permission: Permissions.RECEPTION,
        description: 'Access to the Reception App'
    },
    {
        title: 'Pass',
        permission_needed: [Permissions.PASS],
        permission: Permissions.PASS,
        description: 'Access to the Pass App (kitchen)'
    },
    {
        title: 'Orders',
        permission_needed: [Permissions.ORDERS],
        permission: Permissions.ORDERS,
        description: 'Access to the Orders App (Orders for the bar / kitchen / desserts)'
    },
    {
        title: 'Waiters',
        permission_needed: [Permissions.WAITERS],
        permission: Permissions.WAITERS,
        description: 'Access to the Waiters App'
    },
    {
        title: 'HACCP Admin',
        permission_needed: [Permissions.HACCP_ADMIN],
        permission: Permissions.HACCP_ADMIN,
        description: 'Can create, edit, delete forms and reports'
    },
    {
        title: 'Menu',
        permission_needed: [Permissions.MENU],
        permission: Permissions.MENU,
        description: '',
        aditional: [
            {
                title: 'View Menu',
                permission_needed: [Permissions.MENU],
                permission: Permissions.MENU,
                description: 'Can see the menu page'
            },
            {
                title: 'Create',
                permission_needed: [Permissions.MENU_CREATE, Permissions.MENU],
                permission: Permissions.MENU_CREATE,
                description: 'Can create new items in the menu'
            },
            {
                title: 'Update',
                permission_needed: [Permissions.MENU_UPDATE, Permissions.MENU],
                permission: Permissions.MENU_UPDATE,
                description: 'Can update items in the menu'
            },
            {
                title: 'Delete',
                permission_needed: [Permissions.MENU_DELETE, Permissions.MENU],
                permission: Permissions.MENU_DELETE,
                description: 'Can delete items in the menu'
            }
        ]
    },
    {
        title: 'Send Email',
        permission_needed: [Permissions.SEND_EMAIL],
        permission: Permissions.SEND_EMAIL,
        description: 'Can send emails to employees and clients'
    },
    {
        title: 'Send SMS',
        permission_needed: [Permissions.SEND_SMS],
        permission: Permissions.SEND_SMS,
        description: 'Can send SMS to employees and clients'
    },
    {
        title: 'Roster',
        permission_needed: [Permissions.DAY_ROSTER],
        permission: Permissions.DAY_ROSTER,
        description: 'Can see the roster tasks',
        aditional: [
            {
                title: 'Day Roster',
                permission_needed: [Permissions.DAY_ROSTER],
                permission: Permissions.DAY_ROSTER,
                description: 'Can see the roster for the day'
            },
            {
                title: 'Tasks',
                permission_needed: [Permissions.ROSTER_TASKS, Permissions.DAY_ROSTER],
                permission: Permissions.ROSTER_TASKS,
                description: 'Can see the roster for the day (day roster page) and also edit, create and delete tasks for the employees'
            }
        ]
    },
]