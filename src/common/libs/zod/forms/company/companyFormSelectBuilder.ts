import { z } from "zod";

export const FormSelectBuilderFormSchema = z.object({
    label: z.string().min(3, "Label must be at least 3 characters long"),
    required: z.boolean(),
    description: z.string().optional(),
    options: z.string().array().min(2, "At least two option is required"),
});

export type FormSelectBuilderFormSchemaType = z.infer<typeof FormSelectBuilderFormSchema>;
