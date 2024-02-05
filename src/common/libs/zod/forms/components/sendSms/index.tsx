import { z } from "zod";

export const ComponentsSendSmsSchema = z.object({
    message: z.string().min(2, {
        message: "Please enter a valid text",
    }),
});

export type ComponentsSendSmsSchemaType = z.infer<typeof ComponentsSendSmsSchema>;
