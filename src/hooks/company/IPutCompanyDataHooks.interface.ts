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
    type?: string;
    created_by?: string;
    created_by_id?: string;
}

export interface IPUTFormSectionBody {
    id: string;
    title?: string;
}

export interface IPUTRosterBody {
    id: string;
    duty?: string;
    shift?: string;
    hours?: number;
    status?: IRosterStatus;
    week_payment_preview?: number;
    break_in?: Date;
    break_out?: Date;
    clock_in?: Date;
    clock_out?: Date;
    confirmed?: boolean;
    roster_checked?: boolean;
    week_payment_roster?: number;
    availableBody?: boolean;
    tasks_title?: string[];
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

export type IPUTCompanyDataQueryType = 'ROSTER' | 'HACCP_REPORTS' | 'FORMS' | "FORM_SECTION" | "DUTIES" | "SHIFTS"

export interface IPUTCompanyBody {
    roster?: IPUTRosterBody,
    haccpReport?: IPUTHaccpReportsBody
    form?: IPUTFormBody
    formSection?: IPUTFormSectionBody
    duty?: IPUTDutiesBody
    shift?: IPUTShiftsBody
}