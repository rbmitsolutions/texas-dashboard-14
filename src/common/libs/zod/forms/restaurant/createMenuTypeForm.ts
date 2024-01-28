import { z } from "zod";

export const CreateMenuTypeFormSchema = z.object({
    title: z.string().min(3, {
        message: "The title must be at least 3 characters long",
    }),
    section_id: z.string().min(2, {
        message: "Select a menu section",
    }),
});

export type CreateMenuTypeFormSchemaType = z.infer<typeof CreateMenuTypeFormSchema>;


