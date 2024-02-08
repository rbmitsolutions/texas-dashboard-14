import { IUser } from "../user/user.interface";
import { IFormData } from "./form.interface";

export type IRosterStatus =
    | "unconfirmed"
    | "confirmed"
    | "dayoff"
    | "holiday"
    | "sickday";

export interface IRoster {
    id: string;
    date?: Date;
    duty?: string;
    shift?: string;
    confirmed: boolean;
    role?: string;
    hours?: number;
    hours_roster?: number;
    clock_in?: Date;
    clock_out?: Date;
    break_in?: Date;
    break_out?: Date;

    paid: boolean;
    week_day?: string;
    week_payment_preview?: number;
    week_payment_roster?: number;
    roster_checked?: boolean;

    fixed_salary?: boolean;
    salary?: number;
    available?: boolean;
    forgot_to_clock_out?: boolean;
    absence?: boolean;

    tasks_title?: string[];
    status?: IRosterStatus;

    tasks: IRosterTasks[]

    user?: IUser;
    user_id?: string;

    created_at: Date;
    updated_at: Date;
}

export interface IRosterTasks {
    id: string;

    form_id: string;
    form: string;

    done: boolean;
    form_data: IFormData
    form_data_id: string;

    created_by: string;
    created_id: string;

    roster_id: string;
    roster: IRoster;

    created_at: Date;
    updated_at: Date;
}
export interface IRosterDates {
    id: number;
    date: Date;
    weekDay: string;
    weekDayLong: string;
}

export interface IRosterData {
    users: IUserExtraData[];
    payments_data: {
        total_preview: number;
        total_available: number;
        total_roster: number;
        total_diff: number;
    };
}

export interface IUserExtraData extends IUser {
    preview_hours: string;
    roster_hours: string;
    diff_roster: string;
    preview_roster: string;
    total_roster: string;
}
