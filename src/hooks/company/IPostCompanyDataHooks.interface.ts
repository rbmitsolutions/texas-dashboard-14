import { IDuties, IShifts } from "@/common/types/company/companyDetails.interface";
import { IForm, IFormData, IFormSection } from "@/common/types/company/form.interface";
import { IHaccpReports } from "@/common/types/company/haccpReports.interface";
import { IRoster, IRosterTasks } from "@/common/types/company/roster.interface";
import { ITransactionsDirection, ITransactionsMethod, ITransactionsType } from "@/common/types/company/transactions.interface";

export interface IPOSTTransactionsBody {
    type: ITransactionsType
    method: ITransactionsMethod;
    direction: ITransactionsDirection

    gift_card_id?: string;
    client_id?: string;

    total: number;
    description?: string;

    valid_by?: string;
    valid_by_id?: string;

    payee?: string; // "client`s name" "table`s number" "employee`s name"
    payee_key?: string; // "client`s id" "tables`s is" "employee`s id"
}


export interface IPOSTHaccpReportsBody {
    title: string
    description?: string
    date: {
        gte: Date
        lte: Date
    }
    created_by: string
    created_by_id: string
    reports: {
        form_title: string
        description: string
    }[]
}


export interface IPOSTFormBody {
    title: string;
    inputs: any;
    form_section_id?: string;
    created_by: string;
    created_by_id: string;
}

export interface IPOSTFormSectionBody {
    title: string;
}

export interface IPOSTFormDataBody {
    title: string;
    by: string;
    values: string;
    rosterTask?: {
        id: string
        done: boolean
    }
}


export interface IPOSTShiftsBody {
    title: string
    hours: number
    reduce_break_time: boolean;
    break_minutes: number;
}

export interface IPOSTDutiesBody {
    title: string;
    departament_id: string;
}

export interface IPOSTRosterBody {
    date: Date;
    duty: string;
    shift: string;
    status: string;
    hours: number;
    week_day: string;
    week_payment_preview: number;
    user_id: string;
    fixed_salary: boolean;
    salary: number;
}

export interface IPOSTRosterTasksBody {
    form_id: string;
    form: string;

    created_by: string;
    created_id: string;

    roster_id: string;
}


export type IPOSTCompanyDataQueryType = 'ROSTER' | 'HACCP_REPORTS' | 'FORMS' | "FORM_SECTION" | "FORM_DATA" | "REQUESTS" | 'DUTIES' | 'SHIFTS' | 'ROSTER' | 'ROSTER_TASKS'

export type IPOSTCompanyDataRerturn = IRoster | IHaccpReports | IForm | IFormSection | IFormData | IShifts | IDuties | IRosterTasks
export interface IPOSTCompanyBody {
    roster?: IPOSTRosterBody,
    rosterTask?: IPOSTRosterTasksBody
    haccpReport?: IPOSTHaccpReportsBody
    form?: IPOSTFormBody
    formSection?: IPOSTFormSectionBody
    formData?: IPOSTFormDataBody
    duty?: IPOSTDutiesBody
    shift?: IPOSTShiftsBody
}
