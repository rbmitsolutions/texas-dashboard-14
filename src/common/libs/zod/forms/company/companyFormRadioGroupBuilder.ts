import { z } from "zod";

export const FormRadioGroupBuilderFormSchema = z.object({
    label: z.string().min(3, "Label must be at least 3 characters long"),
    required: z.boolean(),
    description: z.string().optional(),
    options: z.string().array().min(1, "At least one option is required"),
});

export type FormRadioGroupBuilderFormSchemaType = z.infer<typeof FormRadioGroupBuilderFormSchema>;
