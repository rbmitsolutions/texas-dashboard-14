// import { IGETCompanyRosterQuery, IGETCompanyRosterResponse } from "@hooks/company/IGetCompanyDataHooks.interface";
// import { IPayments, IPaymentsType, IRequests, IRosterStatus } from "@interfaces/company";
// import { IReviews } from "@interfaces/restaurant/bookings.interface";
// import { IPaginationResponse, IQueryPagination } from "@interfaces/settings.interface";
// import { IPerformance, IUser } from "@interfaces/user";

// export interface IGETUserPerformanceResponse {
//     data: IPerformance[];
//     pagination: IPaginationResponse
// }

// export interface IGETUserReviewsResponse {
//     data: IReviews[];
//     pagination: IPaginationResponse
// }

// export interface IGETUserRequestsResponse {
//     data: IRequests[];
//     pagination: IPaginationResponse
// }

// export interface IGETUserCompletedProfileResponse {
//     user_id: string;
//     isProfileComplete: boolean;
// }


// export interface IGETUserRosterAnalyticsResponse {
//     total: number;
//     forgot_to_clock_out?: number;
//     sickday?: number;
//     absence?: number;
//     holiday?: number;
//     dayoff?: number;
//     confirmed?: number;
//     unconfirmed?: number;
// }

// export interface IGETUserPaymentAnalyticsResponse {
//     total: number;
//     byMonth: {
//         month: string;
//         total: number;
//     }[];
//     byType: {
//         type: string;
//         title: string;
//         total: number;
//     }[];
// }

// export type IGETUserResponse = IUser | IGETUserPerformanceResponse | IGETUserReviewsResponse | IGETUserRequestsResponse | IGETUserCompletedProfileResponse | IGETUserRosterAnalyticsResponse | IGETUserPaymentAnalyticsResponse | IGETCompanyRosterResponse | IPayments[]

// export type IUserDataQueryType = 'USER' | 'ANALYTICS' | 'PAYMENTS' | 'ROSTER' | 'PERFORMANCE' | 'REVIEWS' | 'REQUESTS' | 'PROFILE_COMPLETED'


// export interface IGETUserDataQuery {
//     user?: {
//         id: string;
//     }
//     profile_completed?: {
//         id: string;
//     }
//     analytics?: {
//         id: string;
//         type: "payments" | "roster"
//         date: Date
//     }
//     roster?: IGETCompanyRosterQuery
//     tasks?: {
//         user_id: string;
//         date: Date;
//         pagination?: IQueryPagination;
//     };
//     payments?: {
//         key: string;
//         type?: IPaymentsType
//         date: {
//             lte: Date;
//             gte: Date;
//         },
//         orderBy?: {
//             key: keyof IPayments
//             order: "asc" | "desc";
//         }
//     }
//     performance?: {
//         all?: {
//             user_id: string;
//             pagination?: IQueryPagination;
//             orderBy?: {
//                 key: keyof IPerformance;
//                 order: "asc" | "desc";
//             };
//         };
//     };
//     reviews?: {
//         all?: {
//             user_id: string;
//             pagination?: IQueryPagination;
//             orderBy?: {
//                 key: keyof IReviews;
//                 order: "asc" | "desc";
//             };
//         };
//     };
//     request?: {
//         all?: {
//             user_id: string;
//             pagination?: IQueryPagination;
//             orderBy?: {
//                 key: keyof IRequests;
//                 order: "asc" | "desc";
//             };
//         };
//     };
// }

// export type IPOSTUserDataQueryType = 'REQUEST' | 'DOCUMENT' | 'HACCP'

// export interface IPOSTUserBody {
//     data: {
//         request?: {
//             type: string;
//             message?: string;
//             user_id: string;
//             answer?: string;
//             dates_off?: string;
//         },
//         document?: {
//             title: string;
//             file: string;
//             user_id: string;
//         }
//         form?: {
//             haccp?: {
//                 form: {
//                     type: string;
//                     date: Date;
//                     comments?: string;
//                     values: any;
//                     by: string;
//                     user_id: string;
//                     roster_id?: string;
//                     key?: string;
//                 };
//             }
//             task?: {
//                 roster_id: string;
//                 form: {
//                     type: string;
//                     date: Date;
//                     comments?: string;
//                     values: any;
//                     by: string;
//                     user_id: string;
//                     roster_id?: string;
//                     key?: string;
//                 };
//             }
//         }

//     }
// }

// export type IPUTUserDataQueryType = 'DETAILS' | "ROSTER" | 'CONTRACT'

// export interface IPUTUserBody {
//     data: {
//         user?: {
//             id: string;
//             details?: IUser
//             new_password?: string;
//             avatar?: {
//                 file: any
//             }
//         }
//         roster?: {
//             roster_id: string;
//             confirmed?: boolean;
//             status?: IRosterStatus
//         }
//         contract?: {
//             file: string;
//             contract_id: string;
//         }
//     }
// }

// export type IDELETEUserDataQueryType = 'DETAILS' | 'REQUESTS' | 'DOCUMENT'

// export interface IDELETEUserBody {
//     data: {
//         avatar?: {
//             id: string;
//         }
//         request?: {
//             id: string;
//         }
//         document?: {
//             id: string;
//         }
//     }
// }