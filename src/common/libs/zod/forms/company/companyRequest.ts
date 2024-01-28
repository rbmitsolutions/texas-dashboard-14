import { z } from "zod";

export const RequestFormSchema = z.object({
    type: z.string(),
    message: z.string().optional(),
});

export type RequestFormSchemaType = z.infer<typeof RequestFormSchema>;
