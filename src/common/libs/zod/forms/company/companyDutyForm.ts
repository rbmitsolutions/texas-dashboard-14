import { z } from "zod";

export const DutyFormSchema = z.object({
    title: z.string().min(3, { message: "Title is required." }),
    departament_id: z.string().min(3, { message: "Departament is required." }),
});

export type DutyFormSchemaType = z.infer<typeof DutyFormSchema>;
