import { z } from "zod";

export const CreateSupplierContactTypeFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters",
    }),
    contact_number: z.string().optional(),
    email: z.string().email({
        message: "Invalid email address",
    }).optional(),
});

export type CreateSupplierContactTypeFormSchemaType = z.infer<typeof CreateSupplierContactTypeFormSchema>;


