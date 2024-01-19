//todo: add interface
export type IFormBuildInput = {}

export interface IFormData {
    id: string;
    title: string;
    by: string;
    values: IFormBuildInput[][];
    type: IFormType;
    created_at: Date;
    updated_at: Date;
  }
  
  export type IFormType = "form" | "task";
  
  export interface IForm {
    id: string;
    title: string;
    inputs: IFormBuildInput[][];
    type: IFormType;
    
    created_by: string
    created_by_id: string
  
    section?: IFormSection;
    form_section_id?: string;
  
    created_at: Date;
    updated_at: Date;
  }
  
  export interface IFormSection {
    id: string;
    title: string;
    forms: IForm[];
    created_at: Date;
    updated_at: Date;
  }
  