import { subDaysToDate } from "@/common/libs/date-fns/dateFormat";
import { PayrollTransactionsType } from "@/common/types/company/transactions.interface";
import { z } from "zod";

export const CreatePaymentToUserFormSchema = z.object({
    type: z.enum([
        PayrollTransactionsType.PAYROLL,
        PayrollTransactionsType.ADJUSTMENT,
        PayrollTransactionsType.BANK_HOLIDAY_PAY,
        PayrollTransactionsType.HOLIDAY,
        PayrollTransactionsType.TIPS,
    ]),
    date: z.date(),
    total: z.number().positive().min(0.01),
});

export type CreatePaymentToUserFormSchemaType = z.infer<typeof CreatePaymentToUserFormSchema>;
