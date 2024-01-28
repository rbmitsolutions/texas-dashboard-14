import { IDuties, IRoles } from "./companyDetails.interface";

export interface IDepartaments {
    id: string;
    title: string;
    roles: IRoles[];
    duties: IDuties[];

    created_at: Date;
    updated_at: Date;
}