import { z } from "zod";

export const CreateSupplierTypeFormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters",
    }),
    address: z.string().min(2, {
        message: "Address must be at least 2 characters",
    }),
    categories_id: z.array(z.string()).nonempty({
        message: "Please select at least one category",
    }),
});

export type CreateSupplierTypeFormSchemaType = z.infer<typeof CreateSupplierTypeFormSchema>;


