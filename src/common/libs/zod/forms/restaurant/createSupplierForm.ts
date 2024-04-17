import { z } from "zod";

export const CreateSupplierTypeFormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters",
    }),
    address: z.string().min(2, {
        message: "Address must be at least 2 characters",
    }),
});

export type CreateSupplierTypeFormSchemaType = z.infer<typeof CreateSupplierTypeFormSchema>;


