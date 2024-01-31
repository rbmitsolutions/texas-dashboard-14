import { z } from "zod";

export const ComponentsSendEmailSchema = z.object({
    subject: z.string().min(3, {
        message: "Please enter a subject",
    }),
    message: z.string().min(2, {
        message: "Please enter a valid text",
    }),
});

export type ComponentsSendEmailSchemaType = z.infer<typeof ComponentsSendEmailSchema>;
