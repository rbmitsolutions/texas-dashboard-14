export interface IAuthorizedDevices {
  id: string;
  ip: string;
  description?: string;

  created_at: Date;
  updated_at: Date;
}
