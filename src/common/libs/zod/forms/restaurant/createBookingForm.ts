import { subDaysToDate } from "@/common/libs/date-fns/dateFormat";
import { z } from "zod";

export const CreateBookingFormSchema = z.object({
    date: z.date(),
    amount_of_people: z.number().int().positive(),
    time: z.string().min(1, "Time is required"),
    request: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),
    contact_number: z.string().min(10, "000 000 0000"),
    email: z.string(),
    table_id: z.string().optional()
});

export type CreateBookingFormSchemaType = z.infer<typeof CreateBookingFormSchema>;