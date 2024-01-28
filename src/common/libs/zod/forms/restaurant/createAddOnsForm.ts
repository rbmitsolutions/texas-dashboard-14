import { z } from "zod";

export const CreateMenuAddOnsFormSchema = z.object({
    title: z.string().min(3, {
        message: "The title must be at least 3 characters long",
    }),
    flag: z.string().optional(),
    is_mandatory: z.boolean(),
    options: z.array(z.object({
        title: z.string().min(1, {
            message: "The title must be at least 3 characters long",
        }),
        value: z.number()
    })),
    menu_ids: z.array(z.string()),
    multiple: z.boolean(),
    min: z.number(),
    max: z.number(),
});

export type CreateMenuAddOnsFormSchemaType = z.infer<typeof CreateMenuAddOnsFormSchema>;