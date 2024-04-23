import { z } from "zod";

export const CreateProductTypeFormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters",
    }),
    code: z.string().min(2, {
        message: "Code must be at least 2 characters",
    }),
    pack_quantity: z.number().int({
        message: "Pack quantity must be an integer",
    }).min(1, {
        message: "Pack quantity must be at least 1",
    }),
    supplier_id: z.string().min(1, {
        message: "Supplier must be selected",
    }),
    item_id: z.string().min(1, {
        message: "Item must be selected",
    }),
});

export type CreateProductTypeFormSchemaType = z.infer<typeof CreateProductTypeFormSchema>;


