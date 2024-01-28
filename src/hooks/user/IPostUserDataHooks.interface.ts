import { IRequests, IRequestsType } from "@/common/types/company/requests.interface";


export interface IPOSTUserRequestsBody {
    type: IRequestsType;
    message?: string;
    dates_off?: string;
}

export type IPOSTUserDataQueryType = 'USER_REQUESTS'

export type IPOSTUserDataRerturn = IRequests

export interface IPOSTUserBody {
    request?: IPOSTUserRequestsBody
}
