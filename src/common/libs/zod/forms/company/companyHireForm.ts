import { z } from "zod";

export const CompanyHireFormSchema = z.object({
    name: z.string().min(3, {
        message: "Please enter a title",
    }),
    email: z.string().email({
        message: "Please enter a valid email",
    }),
    commencement_date: z.date(),
    issue_date: z.date(),
    manager_name: z.string(),
    place_of_work: z.string().min(3, {
        message: "Please enter a valid text",
    }),
    employment_status: z.string().min(3, {
        message: "Please enter a valid text",
    }),
    normal_working_hours: z.string().min(3, {
        message: "Please enter a valid text",
    }),
    fixed_salary: z.boolean(),
    salary: z.number().optional(),
    rate_per_hour: z.number().optional(),
    rate_per_hour_weekend: z.number().optional(),
    role_id: z.string().min(3, {
        message: "Please select a role",
    }),
    visa_needed: z.boolean(),
    signature: z.string().min(3, {
        message: "Please enter a signature",
    }),
});

export type CompanyHireFormSchemaType = z.infer<typeof CompanyHireFormSchema>;
