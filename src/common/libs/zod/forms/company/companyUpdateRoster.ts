import { z } from "zod";

export const UpdateRosterFormSchema = z.object({
    duty: z.string().min(3, 'Select Duty'),
    shift: z.string().min(3, 'Select Duty'),
})
export type UpdateRosterFormSchemaType = z.infer<typeof UpdateRosterFormSchema>;
