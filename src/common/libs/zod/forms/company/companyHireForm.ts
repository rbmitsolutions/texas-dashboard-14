import { z } from "zod";

export const CompanyHireFormSchema = z.object({
    name: z.string().min(3, {
        message: "Please enter a title",
    }),
    email: z.string().email({
        message: "Please enter a valid email",
    }),
    commencement_date: z.string().min(6, {
        message: "Please enter a valid contact number",
    }),
    manager_of: z.string().min(2, {
        message: "Please enter a valid text",
    }),
});

export type CompanyHireFormSchemaType = z.infer<typeof CompanyHireFormSchema>;
