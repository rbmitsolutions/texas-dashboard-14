import { IForm, IFormData, IFormSection, IFormType } from "@/common/types/company/form.interface";
import { IHaccpReports } from "@/common/types/company/haccpReports.interface";
import { IRoster, IRosterStatus } from "@/common/types/company/roster.interface";
import { IPaginationResponse, IQueryPagination } from "@/common/types/settings.interface";

export interface IGETCompanyRosterResponse {
  data: IRoster[];
  pagination: IPaginationResponse
}

export interface IGETCompanyRosterQuery {
  all?: {
    date: {
      gte: Date;
      lte: Date;
    }
    name?: string
    status?: IRosterStatus
    user_id?: string
    includes?: {
      user?: "1"
    }
    pagination?: IQueryPagination
    orderBy?: {
      key: keyof IRoster
      order: "asc" | "desc";
    };
  };
}

export interface IHaccpReportsResponse {
  data: IHaccpReports[];
  pagination: IPaginationResponse
}

export interface IGETHaccpReportsQuery {
  byId?: {
    id: string
  };
  all?: {
    date: {
      gte: Date,
      lte: Date
    }
    title?: string
    created_by?: string
    created_by_id?: string
    orderBy?: {
      key: keyof IHaccpReports
      order: "asc" | "desc";
    };
    pagination?: IQueryPagination
  };
}

export interface IFormsGetAllResponse {
  data: IForm[];
  pagination: IPaginationResponse;
}

export interface IGETFormsQuery {
  byId?: {
    id: string;
    include?: {
      section: "1";
    };
  };
  all?: {
    title?: string;
    type?: IFormType
    section_id?: string;
    created_by_id?: string;
    include?: {
      section: "1";
    };
    orderBy?: {
      key: keyof IForm
      order: "asc" | "desc";
    };
    pagination?: IQueryPagination;
  };
}

export interface IFormSectionGetAllResponse {
  data: IFormSection[];
  pagination: IPaginationResponse;
}

export interface IGETFormSectionQuery {
  byId?: {
    id: string;
    include?: {
      form: "1";
    };
  };
  all?: {
    title?: string;
    include?: {
      form: "1";
    };
    pagination?: IQueryPagination;
  };
}

export interface IGETFormDataQuery {
  all?: {
    title?: string;
    by?: string;
    type?: IFormType
    created_at?: {
      gte: Date;
      lte: Date;
    };
    orderBy?: {
      key: keyof IFormData
      order: "asc" | "desc";
    };
    pagination?: IQueryPagination;
  };
  byId?: {
    id: string;
  };
}

export type ICompanyAllFormsDataReponse = {
  data: IFormData[];
  pagination: IPaginationResponse;
};


export type IGETCompanyResponse = IGETCompanyRosterResponse | IHaccpReportsResponse | IHaccpReports | IFormsGetAllResponse | IForm | IFormSectionGetAllResponse | IFormSection | IGETFormDataQuery | IFormData

export type ICompanyDataQueryType = 'ROSTER' | 'HACCP_REPORTS' | 'FORMS' | "FORM_SECTION" | "FORM_DATA"

export interface IGETCompanyDataQuery {
  roster?: IGETCompanyRosterQuery
  haccpReports?: IGETHaccpReportsQuery
  forms?: IGETFormsQuery
  formSections?: IGETFormSectionQuery
  formData?: IGETFormDataQuery
}
