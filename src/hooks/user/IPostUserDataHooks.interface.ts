import { IFiles, IFilesAs, IFilesType } from "@/common/types/company/files.interface";
import { IRequests, IRequestsType } from "@/common/types/company/requests.interface";


export interface IPOSTUserRequestsBody {
    type: IRequestsType;
    message?: string;
    dates_off?: string;
}

export interface IPOSTUserFilesBody {
    key: string
    as: IFilesAs
    type: IFilesType
    file: any
}

export type IPOSTUserDataQueryType = 'USER_REQUESTS' | 'USER_FILES'

export type IPOSTUserDataRerturn = IRequests 
export interface IPOSTUserBody {
    request?: IPOSTUserRequestsBody
    file?: IPOSTUserFilesBody
}
