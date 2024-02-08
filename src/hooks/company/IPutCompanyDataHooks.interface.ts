import { IRequestsStatus, IRequestsType } from "@/common/types/company/requests.interface";
import { IRosterStatus } from "@/common/types/company/roster.interface";

export interface IPUTHaccpReportsBody {
    title: string
    description?: string
}


export interface IPUTFormBody {
    id: string;
    title?: string;
    inputs?: any
    form_section_id?: string;
    created_by?: string;
    created_by_id?: string;
}

export interface IPUTFormSectionBody {
    id: string;
    title?: string;
}

export interface IPUTRosterBody {
    one?: {
        id: string;
        status?: string;
        duty?: string;
        shift?: string;
        hours_roster?: number;
        week_payment_roster?: number;
        break_in?: Date | null;
        break_out?: Date | null;
        clock_in?: Date | null;
        clock_out?: Date | null;
        confirmed?: boolean;
        roster_checked?: boolean;
        paid?: boolean
        available?: boolean;
        salary?: number;
        hours?: number;
        forgot_to_clock_out?: boolean;
        week_payment_preview?: number;
    }
    many?: {
        ids: string[];
        status?: string;
        break_in?: Date;
        break_out?: Date;
        clock_in?: Date;
        clock_out?: Date;
        confirmed?: boolean;
        roster_checked?: boolean;
        paid?: boolean
        available?: boolean;
        forgot_to_clock_out?: boolean;
        send_email?: {
            start_date: Date;
            end_date: Date;
        }
    }
}

export interface IPUTShiftsBody {
    id: string;
    title: string
    hours: number
    reduce_break_time: boolean;
    break_minutes: number;
};


export interface IPUTDutiesBody {
    id: string;
    title?: string;
    departament_id?: string;
}

export interface IPUTRequestsBody {
    id: string,
    type?: IRequestsType;
    message?: string;
    status: IRequestsStatus
    answer?: string;
}


export type IPUTCompanyDataQueryType = 'ROSTER' | 'HACCP_REPORTS' | 'FORMS' | "FORM_SECTION" | "DUTIES" | "SHIFTS" | 'REQUESTS'
export interface IPUTCompanyBody {
    roster?: IPUTRosterBody,
    haccpReport?: IPUTHaccpReportsBody
    form?: IPUTFormBody
    formSection?: IPUTFormSectionBody
    duty?: IPUTDutiesBody
    shift?: IPUTShiftsBody
    request?: IPUTRequestsBody
}