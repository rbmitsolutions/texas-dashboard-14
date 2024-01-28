import { z } from "zod";

export const VisaDetailsFormSchema = z.object({
    visa_number: z.string().optional(),
    type_of_visa: z.string().optional(),
    id_work_authorization: z.string().optional(),
});

export type VisaDetailsFormSchemaType = z.infer<typeof VisaDetailsFormSchema>;
