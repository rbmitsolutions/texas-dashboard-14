import { z } from "zod";

export const CompanyDocumentFormSchema = z.object({
    title: z.string().min(3, {
        message: "Please enter a title",
    }),
    file: z.string().min(6, {
        message: "Please add a file",
    }),
});

export type CompanyDocumentFormSchemaType = z.infer<typeof CompanyDocumentFormSchema>;
