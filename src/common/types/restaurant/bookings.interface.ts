import { IClient } from "./client.interface";

export type IBookingStatus =
  | "confirmed"
  | "unconfirmed"
  | "canceled"
  | "arrived"
  | "not_shown"
  | "walk_in";

export type IBookingCancelationReason = "dashboard" | "user";
export interface IBookings {
  id: string;

  date: Date;
  weekDay: string;

  amount_of_people: number;
  amount_per_table: number;

  request?: string;
  review_id?: string;
  table_id?: string;

  status: IBookingStatus;
  has_request: boolean;

  cancelation_comment?: string;
  cancelation_reason?: IBookingCancelationReason;
  time: string;

  client_id?: string;
  client?: IClient

  created_at: Date;
  updated_at: Date;
}

export type IReviewsType = "restaurant" | "staff";
export interface IReviews {
  id: string;
  type: IReviewsType;

  review: {
    food: number;
    service: number;
    ambiance: number;

    welcoming: number;
    knowledge: number;
    requests: number;
    timing: number;
    atmosphere: number;

    comment?: string;
  };
  total: number;

  date: Date;

  client: IClient;
  client_id: string;
  key?: string;

  created_at: Date;
  updated_at: Date;
}

export interface IStaffReview {
  welcoming: number;
  knowledge: number;
  requests: number;
  timing: number;
  atmosphere: number;
  comment?: string;
}

export interface IRestaurantReview {
  food: number;
  service: number;
  ambiance: number;
  comment?: string;
}
