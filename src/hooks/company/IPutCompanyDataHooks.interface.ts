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

export type IPUTCompanyDataQueryType = 'ROSTER' | 'HACCP_REPORTS' | 'FORMS' | "FORM_SECTION"

export interface IPUTCompanyBody {
    roster?: any,
    haccpReport?: IPUTHaccpReportsBody
    form?: IPUTFormBody
    formSection?: IPUTFormSectionBody
}