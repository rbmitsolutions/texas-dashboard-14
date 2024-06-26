import { IHistory } from "@/common/types/auth/auth.interface";
import { ICompanyContacts, ICompanyDetails, ICompanyDocuments, ICompanyLinks, IDuties, IRoles, IShifts } from "@/common/types/company/companyDetails.interface";
import { IDepartments } from "@/common/types/company/departaments.interface";
import { IFiles, IFilesAs, IFilesType } from "@/common/types/company/files.interface";
import { IForm, IFormData, IFormSection } from "@/common/types/company/form.interface";
import { IHaccpReports } from "@/common/types/company/haccpReports.interface";
import { IRequests, IRequestsStatus, IRequestsType } from "@/common/types/company/requests.interface";
import { IRoster, IRosterStatus, IRosterTasks } from "@/common/types/company/roster.interface";
import { ITransactions, TransactionsDirection, TransactionsMethod, TransactionsStatus, TransactionsType } from "@/common/types/company/transactions.interface";
import { INotification } from "@/common/types/notifications.interface";
import { IPaginationResponse, IQueryPagination } from "@/common/types/settings.interface";
import { IUser, IUserStatus } from "@/common/types/user/user.interface";

export interface IGETCompanyRosterResponse {
  data: IRoster[];
  pagination: IPaginationResponse
}

export interface IUserExtraPaymentData extends IUser {
  preview_hours: string;
  roster_hours: string;
  diff_roster: number;
  preview_roster: number;
  total_roster: number;
  transactions: ITransactions[]
}

export interface IRosterPaymentPageResponse {
  users: IUserExtraPaymentData[];
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
      task?: '1'
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
  rosterPayment?: {
    name?: string
    status?: IUserStatus
    date: {
      gte: Date;
      lte: Date;
    }
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
  documents: IFiles[]
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
  data: IDepartments[];
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
      key: keyof IDepartments
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
  all?: {
    key?: string
    in?: {
      key?: string[]
    }
    as?: {
      in?: IFilesAs[]
    }
    pagination?: IQueryPagination
    orderBy?: {
      key?: keyof IFiles
      type?: 'asc' | 'desc'
    }
  }

  byId?: {
    id: string
    key?: string
  };

  byKeyAs?: {
    key: string
    as: IFilesAs
    type: IFilesType
  }
}

export interface IGetAllTransactionsResponse {
  data: ITransactions[];
  pagination: IPaginationResponse;
}

export type TransactionsScalarFieldEnum = 'id' | 'type' | 'method' | 'direction' | 'date' | 'status' | 'gift_card_id' | 'client_id' | 'total' | 'description' | 'valid_by' | 'valid_by_id' | 'payee' | 'payee_key' | 'created_at' | 'updated_at'

export interface IGETTransactionsQuery {
  all?: {
    type?: {
      in: TransactionsType[];
    };
    method?: {
      in: TransactionsMethod[];
    };
    direction?: {
      in: TransactionsDirection[];
    };

    date?: {
      gte: Date;
      lte: Date;
    };

    status?: TransactionsStatus

    gift_card_id?: string;
    client_id?: string;

    valid_by_id?: string;
    valid_by?: string;

    payee_key?: string;
    payee?: string;
    created_at?: {
      gte: Date;
      lte: Date;
    };

    pagination?: IQueryPagination;
    orderBy?: {
      key: keyof ITransactions;
      order: "asc" | "desc";
    };
  };
  byId?: {
    id: string;
  };
  analytics?: {
    by: TransactionsScalarFieldEnum[]
    type?: {
      in: TransactionsType[];
    };
    method?: {
      in: TransactionsMethod[];
    };

    direction?: {
      in: TransactionsDirection[];
    };

    date?: {
      gte: Date;
      lte: Date;
    };

    status?: TransactionsStatus

    gift_card_id?: string;
    client_id?: string;

    valid_by_id?: string;

    payee_key?: string;

    created_at?: {
      gte: Date;
      lte: Date;
    };
  }
}

export interface IGETHistoryResponse {
  data: IHistory[];
  pagination: IPaginationResponse;
}

export interface IGETHistoryQuery {
  all: {
    type?: IHistory["type"];
    by?: string;
    pagination: IQueryPagination;
    orderBy?: {
      key: keyof IHistory;
      order: "asc" | "desc";
    };
  }
}


export interface IGetAllNotificationResponse {
  data: INotification[]
  pagination: IPaginationResponse
}

export interface IGETNotificationQuery {
  all?: {
    type?: INotification['type'];
    pagination?: IQueryPagination
    orderBy?: {
      key: keyof INotification
      order: "asc" | "desc";
    };
  }
}

export interface IGETSmsMessage {
  callback_url: string | null
  campaign_id: string | null
  cost: number
  created_at: string
  failed_reason: string | null
  id: string
  is_api: boolean
  message: string
  scheduled_for: string | null
  sender_id: string
  sent_at: string
  sms_count: number
  status: string
  timezone: string | null
  to: string
  type: string
  updated_at: string
}
export interface IGETSmsResponse {
  balance: {
    balance: number
    currency: string
  },
  messages: IGETSmsMessage[]
}

export interface IGETSmsQuery {
  api?: '1'
}


export type IGETCompanyResponse = IGETCompanyRosterResponse | IHaccpReportsResponse | IHaccpReports | IFormsGetAllResponse | IForm | IFormSectionGetAllResponse | IFormSection | IGETFormDataQuery | IFormData | IFiles | IRequests | IRequestsGetAllResponse | ICompanyDetailsResponse | IGETRolesResponse | IRoles | IGETAllDepartamentsResponse | IDepartments | IGETCompanyAllFilesResponse | IGETShiftsQuery | IGETDutiesQuery | IRosterPageResponse | IGETRosterTaskResponse | IUserExtraPaymentData | IGetAllTransactionsResponse | IGetAllNotificationResponse

export type ICompanyDataQueryType = 'ROSTER' | "ROLES" | 'HACCP_REPORTS' | 'FORMS' | "FORM_SECTION" | "FORM_DATA" | "FILES" | "REQUESTS" | 'DETAILS' | "DEPARTAMENTS" | "DUTIES" | "SHIFTS" | 'ROSTER_TASKS' | "TRANSACTIONS" | "HISTORY" | 'NOTIFICATION' | 'SMS'
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
  transactions?: IGETTransactionsQuery
  history?: IGETHistoryQuery
  notification?: IGETNotificationQuery
  sms?: IGETSmsQuery
}
