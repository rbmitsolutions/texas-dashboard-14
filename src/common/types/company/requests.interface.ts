import { IUser } from "../user/user.interface";

export enum IRequestsType {
    Holiday = "Holiday",
    'Day Off' = "Day Off",
    Message = "Message",
}

export enum IRequestsStatus {
    Waiting = "Waiting",
    Approved = "Approved",
    Denied = "Denied",
}

export interface IRequests {
    id: string;
    type: IRequestsType;
    status: IRequestsStatus;
    dates_off: string[];
    request_date: Date; //todo: remove it because we already have created_at
    message?: string;
    answer?: string;
    user?: IUser;
    user_id?: string;

    created_at: Date;
    updated_at: Date;
}
