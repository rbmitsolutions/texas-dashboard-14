import { ISection } from "./tables.interface";

export interface ITablesAvailable {//todo: remove it 
  id: number;
  amount_of_people: number;
  quantity: number;
  active: boolean;
}

export interface ITimesOpen {
  id: string;

  open: string;
  close: string;
  title: string;
  real_time: string;

  active: boolean;

  days: IBookingDays[]
  special_day: ISpecialDays[]

  created_at: Date;
  updated_at: Date;
}
export interface IBookingDays {
  id: string;

  day: string;
  short_day: string;
  times_open: ITimesOpen[];
  section: ISection[]

  created_at: Date;
  updated_at: Date;
}

export interface ISpecialDays {
  id: string;
  date: Date;
  is_disabled: boolean;
  times_open: ITimesOpen[];
  sections_open: ISection[]

  created_at: Date;
  updated_at: Date;
}
