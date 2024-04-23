import { z } from "zod";

export const CreateCategoryTypeFormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters",
    }),
});

export type CreateCategoryTypeFormSchemaType = z.infer<typeof CreateCategoryTypeFormSchema>;


