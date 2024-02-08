import { ICompanyContacts, ICompanyDetails, ICompanyDocuments, ICompanyLinks, IDuties, IRoles, IShifts } from "@/common/types/company/companyDetails.interface";
import { IDepartaments } from "@/common/types/company/departaments.interface";
import { IFiles } from "@/common/types/company/files.interface";
import { IForm, IFormData, IFormSection } from "@/common/types/company/form.interface";
import { IHaccpReports } from "@/common/types/company/haccpReports.interface";
import { IRequests, IRequestsStatus, IRequestsType } from "@/common/types/company/requests.interface";
import { IRoster, IRosterStatus, IRosterTasks } from "@/common/types/company/roster.interface";
import { IPaginationResponse, IQueryPagination } from "@/common/types/settings.interface";
import { IUser, IUserStatus } from "@/common/types/user/user.interface";

export interface IGETCompanyRosterResponse {
  data: IRoster[];
  pagination: IPaginationResponse
}

export interface IUserExtraData extends IUser {
  preview_hours: string;
  roster_hours: string;
  diff_roster: number;
  preview_roster: number;
  total_roster: number;
}

export interface IRosterPageResponse {
  users: IUserExtraData[];
  payments_data: {
    total_preview: number;
    total_available: number;
    total_roster: number;
    total_diff: number;
  };
}

export interface IGETRosterTaskResponse {
  task: IRosterTasks
  form: IForm
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
  rosterPage?: {
    name?: string
    status?: IUserStatus
    date: {
      gte: Date;
      lte: Date;
    }
  }
  rosterTask?: {
    id: string
  }
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

export interface IRequestsGetAllResponse {
  data: IRequests[];
  pagination: IPaginationResponse;
}

export interface IGETRequestsQuery {
  all?: {
    type?: IRequestsType
    status?: IRequestsStatus
    user?: {
      name?: string;
    };
    include?: {
      user?: "1";
    };
    user_id?: string;
    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof IRequests
      order: "asc" | "desc";
    };
  };
  byId?: {
    id: string;
    include?: {
      user?: "1";
    };
  };
}

export interface IGETCompanyDetailsQuery {
  all?: {
    details?: '1',
    contacts?: '1',
    links?: '1',
    documents?: '1',
  }
}

export interface ICompanyDetailsResponse {
  details: ICompanyDetails
  contacts: ICompanyContacts[]
  links: ICompanyLinks[]
  documents: ICompanyDocuments[]
}

export interface IGETRolesResponse {
  data: IRoles[];
  pagination: IPaginationResponse
}
export interface IGETRolesQuery {
  byId?: {
    id: string;
  };
  all?: {
    title?: string;
    includes?: {
      departament?: '1',
      users?: '1'
    }
    pagination?: IQueryPagination
    orderBy?: {
      key: keyof IRoles
      order: "asc" | "desc";
    };
  };
}

export interface IGETAllDepartamentsResponse {
  data: IDepartaments[];
  pagination: IPaginationResponse
}
export interface IGETDepartamentsQuery {
  byId?: {
    id: string;
  };
  all?: {
    title?: string;
    includes?: {
      roles?: '1',
      duties?: '1'
    }
    pagination?: IQueryPagination
    orderBy?: {
      key: keyof IDepartaments
      order: "asc" | "desc";
    };
  };
}

export interface IGETAllDutiesResponse {
  data: IDuties[];
  pagination: IPaginationResponse
}
export interface IGETDutiesQuery {
  all?: {
    pagination?: IQueryPagination
  };
}

export interface IGETAllShiftsResponse {
  data: IShifts[];
  pagination: IPaginationResponse
}

export interface IGETShiftsQuery {
  all?: {
    pagination?: IQueryPagination
  };
}

export interface IGETCompanyAllFilesResponse {
  data: IFiles[];
  pagination: IPaginationResponse
}
export interface IGETFilesQuery {
  byId?: {
    id: string
  };
  all?: {
    key?: string
    in?: {
      id?: string[]
    }
    pagination?: IQueryPagination
  }
}


export type IGETCompanyResponse = IGETCompanyRosterResponse | IHaccpReportsResponse | IHaccpReports | IFormsGetAllResponse | IForm | IFormSectionGetAllResponse | IFormSection | IGETFormDataQuery | IFormData | IFiles | IRequests | IRequestsGetAllResponse | ICompanyDetailsResponse | IGETRolesResponse | IRoles | IGETAllDepartamentsResponse | IDepartaments | IGETCompanyAllFilesResponse | IGETShiftsQuery | IGETDutiesQuery | IRosterPageResponse | IGETRosterTaskResponse

export type ICompanyDataQueryType = 'ROSTER' | "ROLES" | 'HACCP_REPORTS' | 'FORMS' | "FORM_SECTION" | "FORM_DATA" | "FILES" | "REQUESTS" | 'DETAILS' | "DEPARTAMENTS" | "DUTIES" | "SHIFTS" | 'ROSTER_TASKS'

export interface IGETCompanyDataQuery {
  roster?: IGETCompanyRosterQuery
  haccpReports?: IGETHaccpReportsQuery
  forms?: IGETFormsQuery
  formSections?: IGETFormSectionQuery
  formData?: IGETFormDataQuery
  files?: IGETFilesQuery
  requests?: IGETRequestsQuery
  details?: IGETCompanyDetailsQuery
  roles?: IGETRolesQuery
  departments?: IGETDepartamentsQuery
  duties?: IGETDutiesQuery
  shifts?: IGETShiftsQuery
  rosterTask?: IGETCompanyRosterQuery
}
