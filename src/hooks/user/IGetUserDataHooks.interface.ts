import { IRequests, IRequestsStatus, IRequestsType } from "@/common/types/company/requests.interface";
import { IRoster, IRosterStatus } from "@/common/types/company/roster.interface";
import { IPaginationResponse, IQueryPagination } from "@/common/types/settings.interface";
import { IUser, IUserStatus } from "@/common/types/user/user.interface";
import { ICompanyDetailsResponse, IGETCompanyDetailsQuery, IGETCompanyRosterResponse, IGETFilesQuery, IGETTransactionsQuery, IRequestsGetAllResponse } from "../company/IGetCompanyDataHooks.interface";
import { IFiles, IFilesAs, IFilesType } from "@/common/types/company/files.interface";


export interface IGETUserResponse {
    data: IUser[]
    pagination: IQueryPagination
}


export interface IGetAllUserResponse {
    data: IUser[];
    pagination: IPaginationResponse
}

export interface IUserProfileCompletedResponse {
    id: string
    password_updated: boolean
    passport_uploaded: boolean
    poa_uploaded: boolean
    pps_uploaded: boolean
}

export interface IGETUserQuery {
    all?: {
        name?: string;
        status?: IUserStatus
        role_id?: string;
        include?: {
            role?: "1";
            contract?: "1";
            job_application?: "1";
            roster?: {
                available?: '1'
                gte: Date;
                lte: Date;
            };
            documnets?: "1";
        }
        pagination?: IQueryPagination;
        orderBy?: {
            key: keyof IUser
            order: "asc" | "desc";
        };
    }
    byId?: {
        id: string
    }
    byEmail?: {
        email: string
        includes: {
            role?: '1'
        }
    }
    byRosterPassword?: {
        roster_password: string
    }
    profileCompleted?: {
        id: string
    }
    analytics?: {
        roster?: {}
        transactions?: {
            year?: Date
            filter: IGETTransactionsQuery['analytics']
        }
    }
}

export interface IUserGETRequestsQuery {
    all?: {
        type?: IRequestsType
        status?: IRequestsStatus
        user?: {
            name?: string;
        };
        include?: {
            user?: "1";
        };
        user_id: string;
        pagination?: IQueryPagination;
        orderBy?: {
            key: keyof IRequests
            order: "asc" | "desc";
        };
    };
}

export interface IUserGETCompanyRosterQuery {
    all?: {
        date: {
            gte: Date;
            lte: Date;
        }
        name?: string
        status?: IRosterStatus
        user_id: string
        pagination?: IQueryPagination
        orderBy?: {
            key: keyof IRoster
            order: "asc" | "desc";
        };
    };
}

export interface IGetFilesUserResponse {
    data: IFiles[];
    pagination: IPaginationResponse
}


export type IGETUserDataResponse = IUser | IGETUserResponse | IGetAllUserResponse | IGETCompanyRosterResponse | IRequestsGetAllResponse | IUserProfileCompletedResponse | ICompanyDetailsResponse | IGetFilesUserResponse | IFiles
export type IUserDataQueryType = "DETAILS" | "USER_COMPANY" | "USER_ROSTER" | "USER_REQUESTS" | "COMPANY_DETAILS" | 'ANALYTICS' | "USER_FILES"

export interface IGETUserDataQuery {
    user?: IGETUserQuery,
    requests?: IUserGETRequestsQuery
    roster?: IUserGETCompanyRosterQuery
    details?: IGETCompanyDetailsQuery
    analytics?: IGETUserQuery['analytics']
    files?: IGETFilesQuery
}
// USER_FILES_ENDPOINT