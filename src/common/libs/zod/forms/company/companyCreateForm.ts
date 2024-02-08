import { z } from "zod";

export const CreateFormFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    form_section_id: z.string().optional(),
});

export type CreateFormFormSchemaType = z.infer<typeof CreateFormFormSchema>;
