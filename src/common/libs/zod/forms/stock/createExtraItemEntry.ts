import { z } from "zod";

export const CreateExtraItemEntryFormSchema = z.object({
    quantity: z.number().int({
        message: "Min Stock must be an integer, e.g. -100, 100, 200, 300, ...",
    }).step(1),
    description: z.string().optional(),
});

export type CreateExtraItemEntryFormSchemaType = z.infer<typeof CreateExtraItemEntryFormSchema>;


