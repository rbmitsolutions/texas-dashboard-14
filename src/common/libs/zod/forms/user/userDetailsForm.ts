import { z } from "zod";

export const UserDetailsFormSchema = z.object({
    name: z.string().min(3, {
        message: "Please enter a valid name",
    }),
    email: z.string().email({
        message: "Please enter a valid email",
    }),
    date_of_birthday: z.date().min(new Date(1900, 1, 1),{
        message: "Please enter a valid date",
    }),
    contact_number: z.string().min(6, {
        message: "Please enter a valid contact number",
    }),
    shirt_size: z.string().min(1, {
        message: "Please enter a valid shirt size",
    }),
    address: z.string().min(3, {
        message: "Please enter a valid address",
    }),
    city: z.string().min(3, {
        message: "Please enter a valid city",
    }),
    country: z.string().min(3, {
        message: "Please enter a valid country",
    }),
});

export type UserDetailsFormSchemaType = z.infer<typeof UserDetailsFormSchema>;
