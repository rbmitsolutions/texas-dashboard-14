import { z } from "zod";

export const BankDetailsFormSchema = z.object({
    bank: z.string().min(3, {
        message: "Please enter a valid name",
    }),
    iban:z.string().min(3, {
        message: "Please enter a valid name",
    }),
    account_number: z.string().min(6, {
        message: "Please enter a valid contact number",
    }),
    bic: z.string().min(3, {
        message: "Please enter a valid address",
    }),
});

export type BankDetailsFormSchemaType = z.infer<typeof BankDetailsFormSchema>;
