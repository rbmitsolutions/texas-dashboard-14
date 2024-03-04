import { z } from "zod";

export const PaymentDetailsFormSchema = z.object({
    fixed_salary: z.boolean(),
    salary: z.number().optional(),
    rate_per_hour: z.number().optional(),
    rate_per_hour_weekend: z.number().optional(),
    payment_id: z.string(),
});

export type PaymentDetailsFormSchemaType = z.infer<typeof PaymentDetailsFormSchema>;
