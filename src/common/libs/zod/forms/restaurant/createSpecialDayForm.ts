import { subDaysToDate } from "@/common/libs/date-fns/dateFormat";
import { z } from "zod";

export const SpecialDaysFormSchema = z.object({
    date: z.date().min(subDaysToDate(new Date(), 1), "Date must be in the future"),
    is_disabled: z.boolean(),
    section_ids: z.array(z.string()),
    times_open_ids: z.array(z.string()),
}).refine((data) => {
    if (!data.is_disabled) {
        return true; // If is_disabled is true, no further validation needed
    } else {
        return data.section_ids.length >= 1 && data.times_open_ids.length >= 1;
    }
});

export type SpecialDaysFormSchemaType = z.infer<typeof SpecialDaysFormSchema>;
