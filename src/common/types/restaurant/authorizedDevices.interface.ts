export interface IAuthorizedDevices {
  id: string;
  ip: string;
  description: string;
  fingerprint: string;

  created_at: Date;
  updated_at: Date;
}
