import { z } from "zod";

export const CompanyContactsFormSchema = z.object({
    name: z.string().min(3, {
        message: "Please enter a title",
    }),
    email: z.string().email({
        message: "Please enter a valid email",
    }),
    contact_number: z.string().min(6, {
        message: "Please enter a valid contact number",
    }),
    manager_of: z.string().min(2, {
        message: "Please enter a valid text",
    }),
});

export type CompanyContactsFormSchemaType = z.infer<typeof CompanyContactsFormSchema>;
