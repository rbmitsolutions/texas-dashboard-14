import { z } from "zod";

export const CreateSectionTypeFormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters",
    }).max(15, {
        message: "Title must be at most 15 characters",
    }),
    priority: z.number().step(1).min(1, {
        message: "Priority must be at least 1",
    }).max(3, {
        message: "Priority must be at most 3",
    }),
});

export type CreateSectionTypeFormSchemaType = z.infer<typeof CreateSectionTypeFormSchema>;


