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
    type: string;
    created_by: string;
    created_by_id: string;
}

export interface IPOSTFormSectionBody {
    title: string;
}

export interface IPOSTFormDataBody {
    title: string;
    by: string;
    type: string;
    values: string;
}


export type IPOSTCompanyDataQueryType = 'ROSTER' | 'HACCP_REPORTS' | 'FORMS' | "FORM_SECTION" | "FORM_DATA"

export interface IPOSTCompanyBody {
    roster?: any,
    haccpReport?: IPOSTHaccpReportsBody
    form?: IPOSTFormBody
    formSection?: IPOSTFormSectionBody
    formData?: IPOSTFormDataBody
}
