import { z } from "zod";

export const FormInputBuilderFormSchema = z.object({
    label: z.string().min(3, "Label must be at least 3 characters long"),
    required: z.boolean(),
    description: z.string().optional(),
    type: z.string(),
});

export type FormInputBuilderFormSchemaType = z.infer<typeof FormInputBuilderFormSchema>;
