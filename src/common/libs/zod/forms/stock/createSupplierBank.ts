import { z } from "zod";

export const CreateSupplierBankTypeFormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters",
    }),
    iban: z.string().min(2, {
        message: "IBAN must be at least 2 characters",
    }),
    bic: z.string().min(2, {
        message: "BIC must be at least 2 characters",
    }),
});

export type CreateSupplierBankTypeFormSchemaType = z.infer<typeof CreateSupplierBankTypeFormSchema>;


