//todo: add interface

import { IFormBuildInput } from "@/common/utils/formBuilder";
import { IRosterTasks } from "./roster.interface";

export interface IFormData {
  id: string;
  title: string;
  by: string;
  values: IFormBuildInput[][];

  roster_tasks?: IRosterTasks[];

  created_at: Date;
  updated_at: Date;
}


export interface IForm {
  id: string;
  title: string;
  inputs: IFormBuildInput[][];

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
