import { z } from "zod";

export const CreateTableTypeFormSchema = z.object({
    number: z.number().step(1).min(1, {
        message: "Table number must be at least 1",
    }).max(100, {
        message: "Table number must be at most 50",
    }),
    guests: z.number().refine((value) => {
        return value >= 2 && value <= 8 && value % 2 === 0;
    }, {
        message: "Guests must be 2 / 4 / 6 / 8",
    }),
});

export type CreateTableTypeFormSchemaType = z.infer<typeof CreateTableTypeFormSchema>;


