import { IBookings, IReviews } from "@/common/types/restaurant/bookings.interface";
import { z } from "zod";

export const UpdateClientFormSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    contact_number: z.string().min(10, {
        message: "Please enter a valid contact number e.g 083 123 4567",
    }),
});


export interface IClientSchema extends z.infer<typeof UpdateClientFormSchema> {
    id: string,

    valid_number: boolean;
    blocked: boolean;
    qnt_of_bookings: number;
    complaints: number;
    restaurant_review: number;
    staff_review: number;
    spent: number;

    bookings?: IBookings[];
    reviews?: IReviews[];
    created_at: Date,
    updated_at: Date,
}

export type UpdateClientSchemaType = z.infer<typeof UpdateClientFormSchema>;
