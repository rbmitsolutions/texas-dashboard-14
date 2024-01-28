export type IGiftCardStatus = "confirmed" | "sent" | "unsent" | "spent";
export interface IGiftCards {
  id: string;

  value: number;
  email?: string;
  name?: string;
  last_name?: string;
  contact_number?: string;
  message?: string;

  name_to?: string;
  address_to?: string;
  address_2_to?: string;

  city_to?: string;
  country_to?: string;
  eircode_to?: string;
  stripe_secret?: string;

  payed: boolean;
  token: string;

  sent_date?: Date;
  sent_by?: string;
  code: string;

  status: IGiftCardStatus;
  spent: number;

  client_key: string;

  updated_at: Date;
  created_at: Date;
}
