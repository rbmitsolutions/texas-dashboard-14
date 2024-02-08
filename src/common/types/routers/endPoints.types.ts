export enum EndPointsTypes {
    AUTH_ENDPOINT_SIGNIN = "/auth/signin",
    AUTH_ENDPOINT_SIGNUP = "/auth/signup",
    AUTH_ENDPOINT_FORGOT = "/auth/forgot",
    AUTH_ENDPOINT_REFRESH_TOKEN= "/auth/refresh-token",
    AUTH_ENDPOINT_WHEN_SIGN_IN = '/admin/roster',

    COMPANY_FORM_SECTIONS_ENDPOINT = '/company/form-sections',
    COMPANY_HACCP_REPORTS_ENDPOINT = '/company/haccp-reports',
    COMPANY_TRANSACTIONS_ENDPOINT = '/company/transactions',
    COMPANY_DEPARTMENTS_ENDPOINT = '/company/departments',
    COMPANY_PERFORMANCE_ENDPOINT = '/company/performance',
    COMPANY_FORM_DATA_ENDPOINT = '/company/form-data',
    COMPANY_DOCUMENTS_ENDPOINT = '/company/documents',
    COMPANY_CONTACTS_ENDPOINT = '/company/contacts',
    COMPANY_PAYMENTS_ENDPOINT = '/company/payments',
    COMPANY_REQUESTS_ENDPOINT = '/company/requests',
    COMPANY_CONTRACT_ENDPOINT = '/company/contract',
    COMPANY_SHIFTS_ENDPOINT = '/company/shifts',
    COMPANY_DUTIES_ENDPOINT = '/company/duties',
    COMPANY_ROSTER_ENDPOINT = '/company/roster',
    COMPANY_ROSTER_TASKS_ENDPOINT = '/company/roster/tasks',
    COMPANY_TASKS_ENDPOINT = '/company/tasks',
    COMPANY_HACCP_ENDPOINT = '/company/haccp',
    COMPANY_USERS_ENDPOINT = '/company/users',
    COMPANY_ROLES_ENDPOINT = '/company/roles',
    COMPANY_LINKS_ENDPOINT = '/company/links',
    COMPANY_FORMS_ENDPOINT = '/company/forms',
    COMPANY_FILES_ENDPOINT = '/company/files',
    COMPANY_DETAILS_ENDPOINT = '/company/details',

    ANALYTICS_BOOKINGS_ENDPOINT = '/analytics/bookings',

    RESTAURANT_AUTHORIZED_DEVICES_ENDPOINT = '/restaurant/authorized-devices',
    RESTAURANT_FINISHED_TABLES_ENDPOINT = '/restaurant/finished-tables',
    RESTAURANT_ORDER_CONTROLLER_ENDPOINT = '/restaurant/order-controller',
    RESTAURANT_SPECIAL_DAYS_ENDPOINT = '/restaurant/special-days',
    RESTAURANT_TIMES_OPEN_ENDPOINT = '/restaurant/times-open',
    RESTAURANT_OPEN_DAYS_ENDPOINT = '/restaurant/open-days',
    RESTAURANT_GIFTCARD_ENDPOINT = '/restaurant/giftcard',
    RESTAURANT_SECTIONS_ENDPOINT = '/restaurant/sections',
    RESTAURANT_BOOKING_ENDPOINT = '/restaurant/booking',
    RESTAURANT_TABLES_ENDPOINT = '/restaurant/tables',
    RESTAURANT_CLIENT_ENDPOINT = '/restaurant/clients',
    RESTAURANT_REVIEWS_ENDPOINT = '/restaurant/reviews',
    RESTAURANT_ORDER_ENDPOINT = '/restaurant/order',
    
    RESTAURANT_MENU_ADD_ONS_OPTIONS_ENDPOINT = '/restaurant/menu-add-ons-options',
    RESTAURANT_MENU_SECTION_ENDPOINT = '/restaurant/menu-sections',
    RESTAURANT_MENU_ADD_ONS_ENDPOINT = '/restaurant/menu-add-ons',
    RESTAURANT_MENU_TYPES_ENDPOINT = '/restaurant/menu-type',
    RESTAURANT_PRINTERS_ENDPOINT = '/restaurant/printers',
    RESTAURANT_MENU_ENDPOINT = '/restaurant/menu',

    APP_CLOCKIN_ENDPOINT = '/app/clockin',
    APP_DAYROSTER_ENDPOINT = '/app/dayroster',

    USER_PROFILE_COMPLETED_ENDPOINT = '/user/profile-completed',
    USER_ROSTER_ANALYTICS_ENDPOINT = '/user/roster-analytics',
    USER_PERFORMANCE_ENDPOINT = "/user/performance",
    USER_DOCUMENTS_ENDPOINT = "/user/documents",
    USER_ANALYTICS_ENDPOINT = "/user/analytics",
    USER_PAYMENTS_ENDPOINT = "/user/payments",
    USER_REQUEST_ENDPOINT = "/user/requests",
    USER_CONTRACT_ENDPOINT = "/user/contract",
    USER_COMPANY_ENDPOINT = "/user/company",
    USER_REVIEWS_ENDPOINT = "/user/reviews",
    USER_ROSTER_ENDPOINT = "/user/roster",
    USER_HACCP_ENDPOINT = "/user/haccp",
    USER_ENDPOINT = "/user",

    SERVICES_OPENAI_ENDPOINT = "/services/openai",
    SERVICES_HISTORY_ENDPOINT = "/services/history",
    SERVICES_POYNT_ENDPOINT = "/services/poynt",
    SERVICES_EMAIL_ENDPOINT = "/services/email",
    SERVICES_SMS_ENDPOINT = "/services/sms"
}