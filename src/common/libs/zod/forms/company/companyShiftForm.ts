import { z } from "zod";

export const ShiftFormSchema = z.object({
    from: z.string().min(3, { message: "From is required." }),
    to: z.string().min(3, { message: "To is required." }),
    break: z.number().min(0, { message: "Break is required." }),
});

export type ShiftFormSchemaType = z.infer<typeof ShiftFormSchema>;
