import { z } from "zod";

export const TimesOpenSchema = z.object({
    from: z.string().min(3, { message: "From is required." }),
    to: z.string().min(3, { message: "To is required." }),
    days_ids: z.array(z.string()),
});

export type TimesOpenSchemaType = z.infer<typeof TimesOpenSchema>;
