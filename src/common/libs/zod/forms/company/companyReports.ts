import { z } from "zod";

export const ReportsFormSchema = z.object({
    title: z.string().min(3, {
        message: "Please enter a title",
    }),
    description: z.string().optional(),
    from: z.date({
        required_error: "Please select a date",
    }),
    to: z.date(),
    reports: z.array(
        z.object({
            form_id: z.string().describe("form_id"),
            form_title: z.string().describe("form_title"),
            description: z.string().describe("description"),
        })
    ).min(1),
});

export type ReportsFormSchemaType = z.infer<typeof ReportsFormSchema>;
