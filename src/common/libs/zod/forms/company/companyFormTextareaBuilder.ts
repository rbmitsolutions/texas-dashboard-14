import { z } from "zod";

export const FormTextareaBuilderFormSchema = z.object({
    label: z.string().min(3, "Label must be at least 3 characters long"),
    required: z.boolean(),
    description: z.string().optional(),
});

export type FormTextareaBuilderFormSchemaType = z.infer<typeof FormTextareaBuilderFormSchema>;
