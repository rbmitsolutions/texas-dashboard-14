export type IDELETECompanyDataQueryType = 'HACCP_REPORTS' | 'FORMS' | 'ROSTER' | "FORM_SECTION"

export interface IDELETECompanyDataBody {
  roster?: {
    id: string;
  },
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
  formData?:{
    id: string;
  }
}