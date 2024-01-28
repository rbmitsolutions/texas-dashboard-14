export interface ITablesAvailable {
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
  tables_available: ITablesAvailable[];
  active: boolean;
}
export interface IDays {
  id: number;
  day: string;
  short_day: string;
  times_open: ITimesOpen[];
}

export interface ISpecialDays {
  id?: string;
  date: Date;
  is_disabled: boolean;
  times_open?: ITimesOpen[];
}
