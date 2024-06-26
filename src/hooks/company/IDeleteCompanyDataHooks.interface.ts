export type IDELETECompanyDataQueryType = 'HACCP_REPORTS' | 'FORMS' | 'ROSTER' | 'ROSTER_TASKS' | "FORM_SECTION" | "DUTIES" | "SHIFTS" | 'DEPARTAMENTS' | 'ROLES' | "CONTACTS" | "LINKS" | "DOCUMENTS" | 'FILES' | 'NOTIFICATION'

export interface IDELETECompanyDataBody {
  roster?: {
    id: string;
  },
  rosterTask?: {
    id: string;
  }
  haccpReport?: {
    id: string;
    file_id: string;
  },
  form?: {
    id: string;
  }
  formSection?: {
    id: string;
  },
  formData?: {
    id: string;
  }
  request?: {
    id: string;
  }
  duty?: {
    id: string
  }
  shift?: {
    id: string
  }
  departament?: {
    id: string
  }
  role?: {
    id: string
  }
  contact?: {
    id: string
  }
  link?: {
    id: string
  }
  document?:{
    file_id: string
  }
  file?: {
    id: string
  }
  notification?: {
    id: string
  }
}