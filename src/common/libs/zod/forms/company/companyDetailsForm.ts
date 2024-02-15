import { z } from "zod";

export const CompanyDetailsFormSchema = z.object({
    name: z.string().min(3, {
        message: "Please enter a title",
    }),
    email: z.string().email({
        message: "Please enter a valid email",
    }),
    contact_number: z.string().min(6, {
        message: "Please enter a valid contact number",
    }),
    address: z.string().min(10, {
        message: "Please enter a valid address",
    }),
});

export type CompanyDetailsFormSchemaType = z.infer<typeof CompanyDetailsFormSchema>;
