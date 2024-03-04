import { IRefreshToken, ITokens } from "../auth/auth.interface";
import { IRoles } from "../company/companyDetails.interface";
import { IRequests } from "../company/requests.interface";
import { IRoster } from "../company/roster.interface";

export type IUserStatus = "Working" | "Application" | "Filled";

export interface IUser {
    id: string;
    name: string;
    email: string;
    status: IUserStatus;
    roster_password: number;
    available_days?: IAvailableDays[];

    fixed_salary: boolean;
    salary?: number;
    rate_per_hour?: number;
    rate_per_hour_weekend?: number;
    payment_id?: string;

    date_of_birthday?: Date;
    sex?: string;
    contact_number?: string;
    shirt_size?: string;
    address?: string;
    city?: string;
    country?: string;

    profile_image?: string;
    id_profile_image?: string;

    bank?: string;
    iban?: string;
    account_number?: string;
    bic?: string;
    notes?: string;

    emergency_name?: string;
    emergency_contact_number?: string;
    emergency_email?: string;
    emergency_city?: string;
    emergency_country?: string;
    emergency_adress?: string;

    visa_needed: boolean;
    visa_number?: string;
    visa_valid_until?: Date;
    type_of_visa?: string;
    id_work_authorization?: string;

    refresh_token?: IRefreshToken
    token?: ITokens[];
    requests?: IRequests[];
    roster?: IRoster[];
    //   documents?: IUserDocuments[];
    //   haccp?: IHaccp[];
    //   performance: IPerformanc[];

    //   contract?: IContract;

    job_application?: IJobApplication;

    role_id?: string;
    role?: IRoles

    created_at: Date;
    updated_at: Date;
}

export interface IAvailableDays {
    weekDay: string;
    available: boolean;
    shift: string[];
}

export interface IJobApplicationValues {
    position: string,
    work_permit: string,
    leaving_certificate: string,
    experience: string,
    another_position: string,
    applied_before: string,
    health_limitations: string,
    notice_period: string,
    start_date: string,
    additional_information: string,
}

export interface IJobApplication {
    id: string;
    user_id: string;
    cv_id: string;
    cv_url: string;
    date: Date;
    values: IJobApplicationValues;

    created_at: Date;
    updated_at: Date;
}