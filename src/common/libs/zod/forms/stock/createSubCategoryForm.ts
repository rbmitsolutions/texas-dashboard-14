import { z } from "zod";

export const CreateSubCategotyTypeFormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters",
    }),
    category_id: z.string().min(1, {
        message: "Category is required",
    }),
});

export type CreateSubCategotyTypeFormSchemaType = z.infer<typeof CreateSubCategotyTypeFormSchema>;


