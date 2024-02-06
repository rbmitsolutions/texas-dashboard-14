import { z } from "zod";

export const CreateRosterFormSchema = z.object({
    is_dayoff: z.boolean(),
    duty: z.string(),
    shift: z.string(),
})
export type CreateRosterFormSchemaType = z.infer<typeof CreateRosterFormSchema>;
