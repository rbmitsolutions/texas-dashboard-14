import { z } from "zod";

export const GiftCardFormSchema = z.object({
    value: z.number().min(10, 'Minimum value is $10').max(500, 'Maximum value is $500'),
    code: z.string().min(3, 'Minimum length is 16').max(10, 'Maximum length is 16'),
    status: z.string(),
    client_key: z.string(),
    name: z.string(),
    email: z.string().email(),
    contact_number: z.string(),
    method: z.string(),
});

export type GiftCardFormSchemaType = z.infer<typeof GiftCardFormSchema>;
