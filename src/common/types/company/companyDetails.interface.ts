import { Permissions } from "../auth/auth.interface";
import { IUser } from "../user/user.interface";
import { IDepartments } from "./departaments.interface";

export interface ICompanyDetails {
    id: string;
    name?: string;
    email?: string;
    contact_number?: string;
    address?: string;
    registration_number?: string;
}

export interface IShifts {
    id: string;
    title: string;
    hours: number;
    reduce_break_time: boolean; //todo remove it
    break_minutes: number;

    created_at: Date;
    updated_at: Date;
}

export interface ICompanyContacts {
    id: string;
    name: string;
    contact_number?: string;
    email?: string;
    manager_of: string;
}

export interface ICompanyDocuments {
    id: string;
    title: string;
    description?: string;
    url: string;
    public_id: string;
    secure_url: string;
}

export interface IRoles {
    id: string;
    title: string;
    permissions: Permissions[];
    
    users: IUser[];
    departament_id: string;
    departament: IDepartments

    created_at: Date;
    updated_at: Date;
}

export interface IDuties {
    id: string;
    title: string;
    departament_id: string;
    departament: IDepartments
}

export interface ICompanyLinks {
    id: string;
    title: string;
    description?: string;
    link: string;
    section: string;
}

// IDepartments