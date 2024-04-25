import { z } from "zod";

export const CreateSupplierAutoOrderTypeFormSchema = z.object({
    week_day: z.string().min(1),
    email: z.string().email({
        message: "Invalid email address",
    }),
});

export type CreateSupplierAutoOrderTypeFormSchemaType = z.infer<typeof CreateSupplierAutoOrderTypeFormSchema>;


