import { IBookings, IReviews } from "./bookings.interface";

export interface IClient {
  id: string;
  email: string;
  name: string;
  contact_number: string;
  valid_number: boolean;
  blocked: boolean;
  qnt_of_bookings: number;
  complaints: number;
  restaurant_review: number;
  staff_review: number;
  spent: number;
  
  bookings?: IBookings[];
  reviews?: IReviews[];

  created_at: Date;
  updated_at: Date;
}
