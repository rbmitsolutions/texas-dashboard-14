import { IRosterStatus } from "@/common/types/company/roster.interface";
import { IAvailableDays, IUserStatus } from "@/common/types/user/user.interface";

export interface IPUTUserDetailsBody {
    id: string
    name?: string;
    password?: string;
    status?: IUserStatus
    roster_password?: '1'


    available_days?: IAvailableDays[];

    fixed_salary?: boolean;
    salary?: number;
    rate_per_hour?: number;
    rate_per_hour_weekend?: number;

    date_of_birthday?: Date;
    sex?: string;
    contact_number?: string;
    shirt_size?: string;
    address?: string;
    city?: string;
    country?: string;

    profile_image?: string | null;
    id_profile_image?: string | null;
    profile_file_id?: string | null

    bank?: string;
    iban?: string;
    account_number?: string;
    bic?: string;
    notes?: string;
    payment_id?: string;

    emergency_name?: string;
    emergency_contact_number?: string;
    emergency_email?: string;
    emergency_city?: string;
    emergency_country?: string;
    emergency_adress?: string;

    visa_needed?: boolean;
    visa_number?: string;
    visa_valid_until?: Date;
    type_of_visa?: string;
    id_work_authorization?: string;

    role_id?: string;
}

export interface IPUTUserRosterBody {
    one: {
        id: string;
        status?: string;
        confirmed?: boolean;
        roster_checked?: boolean;
    }

}

export type IPUTUserDataQueryType = 'DETAILS' | 'USER_ROSTER'

export interface IPUTUserBody {
    details?: IPUTUserDetailsBody
    roster?: IPUTUserRosterBody,
}