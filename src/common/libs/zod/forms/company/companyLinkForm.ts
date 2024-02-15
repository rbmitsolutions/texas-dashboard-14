import { z } from "zod";

export const CompanyLinkFormSchema = z.object({
    title: z.string().min(3, {
        message: "Please enter a title",
    }),
    link: z.string().min(3, {
        message: "Please enter a title",
    }),
    section: z.string().min(6, {
        message: "Please enter a valid contact number",
    }),
    description: z.string()
});

export type CompanyLinkFormSchemaType = z.infer<typeof CompanyLinkFormSchema>;
