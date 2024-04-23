import { z } from "zod";

export const CreateOrderTypeFormSchema = z.object({
    product_quantity: z.string().min(1, 'Please select a quantity'),
});

export type CreateOrderTypeFormSchemaType = z.infer<typeof CreateOrderTypeFormSchema>;


