import { IUser } from "../user/user.interface";

export type IRequestsType = "Holiday" | "Day Off" | "Message";
export type IRequestsStatus = "Waiting" | "Approved" | "Denied";

export interface IRequests {
    id: string;
    type: IRequestsType;
    status: IRequestsStatus;
    dates_off: string[];
    request_date: Date;
    message?: string;
    answer?: string;
    user?: IUser;
    user_id?: string;

    created_at: Date;
    updated_at: Date;
}
