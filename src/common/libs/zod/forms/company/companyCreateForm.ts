import { z } from "zod";

export const CreateFormFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    type: z.string().min(3, "Select a type"),
    form_section_id: z.string().min(3, "Select a section"),
});

export type CreateFormFormSchemaType = z.infer<typeof CreateFormFormSchema>;
