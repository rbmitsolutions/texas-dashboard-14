// import { IDepartments } from "./company/companyDetails.interface";
// import { IUser } from "./user/user.interface";


// const RoleT: IRolesT = {
//     id: '1',
//     title: 'Receptionist',
//     permission: [
//         {
//             id: '1',
//             title: 'booking',
//             auth: ["list", "pagination", "create", "update", "delete"],
//             role_id: '1',
//             roles: {} as IRolesT,
//             only_at_texas: true,
//             authorized_devices: [
//                 {
//                     id: '1',
//                     ip: '1',
//                     permission_id: '1',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 }
//             ],
//             routers: [
//                 {
//                     id: '1',
//                     title: 'Booking',

//                     permission: {} as IPermissionT,
//                     permission_id: '1',

//                     icon: 'icon',
//                     layout: 'Booking',
//                     path: '/admin/restaurant/booking/all',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     id: '2',
//                     title: 'Booking Test',

//                     permission: {} as IPermissionT,
//                     permission_id: '1',

//                     icon: 'icon',
//                     layout: 'Booking',
//                     path: '/admin/restaurant/booking/create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     id: '3',
//                     title: 'Booking Test 2',

//                     permission: {} as IPermissionT,
//                     permission_id: '1',

//                     icon: 'icon',
//                     layout: 'Booking',
//                     path: '/admin/restaurant/booking/test',
//                     created_at: new Date(),
//                     updated_at: new Date(),

//                 },
//                 {
//                     id: '4',
//                     title: 'Analytics',

//                     permission: {} as IPermissionT,
//                     permission_id: '1',

//                     icon: 'icon',
//                     layout: 'Analytics',
//                     path: '/admin/restaurant/bookings/analytics',
//                     created_at: new Date(),
//                     updated_at: new Date(),

//                 }
//             ],
//             created_at: new Date(),
//             updated_at: new Date(),
//         },
//         {
//             id: '2',
//             title: 'Menu',
//             auth: ["list", "create", "update", "delete"],
//             role_id: '1',
//             roles: {} as IRolesT,
//             only_at_texas: true,
//             authorized_devices: [
//                 {
//                     id: '1',
//                     ip: '1',
//                     permission_id: '1',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 }
//             ],
//             routers: [
//                 {
//                     id: '1',
//                     title: 'Menu',

//                     permission: {} as IPermissionT,
//                     permission_id: '1',

//                     icon: 'icon',
//                     layout: 'Menu',
//                     path: '/admin/restaurant/menu/all',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     id: '2',
//                     title: 'Menu Test',

//                     permission: {} as IPermissionT,
//                     permission_id: '1',

//                     icon: 'icon',
//                     layout: 'Menu',
//                     path: '/admin/restaurant/menu/create',
//                     created_at: new Date(),
//                     updated_at: new Date(),

//                 }
//             ],
//             created_at: new Date(),
//             updated_at: new Date(),
//         }
//     ],
//     created_at: new Date(),
//     updated_at: new Date(),
// }


// export interface IRolesT {
//     id: string;
//     title: string;

//     // users: IUser[];
//     // departament_id: string;
//     // departament: IDepartments;

//     permission: IPermissionT[]

//     created_at: Date;
//     updated_at: Date;
// }


// export interface IPermissionT {
//     id: string
//     title: string //booking
//     auth: string[] // ["create", "pagination", "create", "update", "delete"]
//     only_at_texas: boolean

//     authorized_devices: IAuthorizedDevicesT[]
//     routers: IRouterT[]

//     roles: IRolesT
//     role_id: string

//     created_at: Date
//     updated_at: Date
// }

// export interface IAuthorizedDevicesT {
//     id: string;
//     ip: string;
//     description?: string;
//     permission_id: string;
//     created_at: Date;
//     updated_at: Date;
// }

// export interface IRouterT {
//     id: string

//     title: string
//     path: string
//     icon: string
//     layout: string

//     permission: IPermissionT
//     permission_id: string

//     created_at: Date
//     updated_at: Date
// }

// export default RoleT
